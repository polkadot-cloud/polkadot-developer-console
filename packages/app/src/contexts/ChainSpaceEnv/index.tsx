// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { eqSet, setStateWithRef } from '@w3ux/utils';
import { isCustomEvent } from 'Utils';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { AccountBalances } from 'model/AccountBalances';
import type {
  APIStatusEventDetail,
  ApiInstanceId,
  ApiStatus,
} from 'model/Api/types';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import type {
  ChainSpaceApiStatuses,
  ChainSpaceChainSpecs,
  ChainSpaceEnvContextInterface,
  ChainSpaceEnvProps,
  ConnectedChain,
  PalletVersions,
} from './types';
import { defaultChainSpaceEnvContext } from './defaults';
import { useGlobalChainSpace } from 'contexts/GlobalChainSpace';
import type { ChainId } from 'config/networks/types';
import { ApiController } from 'controllers/Api';
import { BlockNumber } from 'model/BlockNumber';
import { useApiIndexer } from 'contexts/ApiIndexer';
import type { OwnerId } from 'types';
import { useTabs } from 'contexts/Tabs';
import { ownerIdToTabId, tabIdToOwnerId } from 'contexts/Tabs/Utils';
import type { ApiIndexLabel } from 'contexts/ApiIndexer/types';
import type { MetadataVersion } from 'model/Metadata/types';
import type { ApiPromise } from '@polkadot/api';
import { PalletScraper } from 'model/Scraper/Pallet';
import { xxhashAsHex } from '@polkadot/util-crypto';
import { u16 } from 'scale-ts';
import type { AnyJson } from '@w3ux/types';
import { getApiInstanceOwnerAndIndex } from './Utils';
import { useTxMeta } from 'contexts/TxMeta';

export const ChainSpaceEnv = createContext<ChainSpaceEnvContextInterface>(
  defaultChainSpaceEnvContext
);

export const useChainSpaceEnv = () => useContext(ChainSpaceEnv);

export const ChainSpaceEnvProvider = ({ children }: ChainSpaceEnvProps) => {
  const {
    tabs,
    getTabTaskData,
    getTabActiveTask,
    resetTabActiveTask,
    getActiveTaskChainIds,
  } = useTabs();
  const {
    getTabApiIndex,
    setTabApiIndex,
    getTabApiIndexes,
    removeTabApiIndex,
  } = useApiIndexer();
  const { destroyInstanceTxMeta } = useTxMeta();
  const { globalChainSpace } = useGlobalChainSpace();

  // The chain spec of each api instance associated with this chain space. NOTE: Requires ref as it
  // is used in event listener.
  const [chainSpecs, setChainSpecsState] = useState<ChainSpaceChainSpecs>({});
  const chainSpecsRef = useRef(chainSpecs);

  // Setter for chain spec. Updates state and ref.
  const setChainSpecs = (newChainSpecs: ChainSpaceChainSpecs) => {
    setStateWithRef(newChainSpecs, setChainSpecsState, chainSpecsRef);
  };

  // The API status of the api instances associated with this chain space. NOTE: Requires ref as it
  // is used in event listener.
  const [apiStatuses, setApiStatusesState] = useState<ChainSpaceApiStatuses>(
    {}
  );
  const apiStatusesRef = useRef(apiStatuses);

  // Stores pallet versions of a chain, keyed by tab.
  const [palletVersions, setPalletVersions] = useState<PalletVersions>({});

  // Gets an api instace by instance id.
  const getApiInstanceById = (instanceId: ApiInstanceId) => {
    const { ownerId, index } = getApiInstanceOwnerAndIndex(instanceId);
    return ApiController.instances[ownerId]?.[index];
  };

  // Gets an api instance by tab and label.
  const getApiInstance = (ownerId: OwnerId, label: ApiIndexLabel) => {
    const apiIndex = getTabApiIndex(ownerId, label);

    if (apiIndex !== undefined) {
      return ApiController.instances[ownerId]?.[apiIndex.index];
    }
  };

  // Get all unique connected chains from chain specs.
  const getConnectedChains = () => {
    const chains = Object.entries(chainSpecs).reduce(
      (acc: ConnectedChain[], [instanceId, spec]) => {
        // Filter out disconnected chains.
        if (spec.chain === null) {
          return acc;
        }
        // Filter out chains with no api instance
        const api = getApiInstanceById(instanceId)?.api;
        if (!api) {
          return acc;
        }
        acc.push({
          specName: spec.version.specName,
          genesisHash: api.genesisHash.toHex(),
        });
        return acc;
      },
      []
    );
    return [...new Set(chains)];
  };

  // Get a caip for a chain id. Used for submitting transactions via Wallet Connect.
  const getChainIdCaip = (chainId: string) => {
    const chain = getConnectedChains().find(
      (connectedChain) => connectedChain.specName === chainId
    );
    return `polkadot:${chain?.genesisHash.substring(2).substring(0, 32) || ''}`;
  };

  // Setter for api status. Updates state and ref.
  const setApiStatuses = (newApiStatuses: ChainSpaceApiStatuses) => {
    setStateWithRef(newApiStatuses, setApiStatusesState, apiStatusesRef);
  };

  // Get chainSpec for an instance by id.
  const getChainSpec = (instanceId?: ApiInstanceId) => {
    if (instanceId === undefined) {
      return undefined;
    }
    return chainSpecsRef.current[instanceId];
  };

  // Removes a chainSpec for an instance by id.
  const removeChainSpec = (instanceId: ApiInstanceId) => {
    const updatedChainSpecs = { ...chainSpecsRef.current };
    delete updatedChainSpecs[instanceId];
    setChainSpecs(updatedChainSpecs);
  };

  // Removes palletVersions for an instance by id.
  const removePalletVersions = (ownerId: OwnerId) => {
    const updatedPalletVersions = { ...palletVersions };
    delete updatedPalletVersions[ownerId];
    setPalletVersions(updatedPalletVersions);
  };

  // Get an api status for an instance by id.
  const getApiStatus = (instanceId?: ApiInstanceId) => {
    if (instanceId === undefined) {
      return 'disconnected';
    }
    return apiStatusesRef.current[instanceId] || 'disconnected';
  };

  // Set an api status for an instance by id.
  const setApiStatus = (instanceId: ApiInstanceId, status: ApiStatus) => {
    setApiStatuses({
      ...apiStatusesRef.current,
      [instanceId]: status,
    });
  };

  // Remove an api status for an instance by id.
  const removeApiStatus = (instanceId: ApiInstanceId) => {
    const updatedApiStatuses = { ...apiStatusesRef.current };
    delete updatedApiStatuses[instanceId];
    setApiStatuses(updatedApiStatuses);
  };

  // Handle connecting to an api instance.
  const handleConnectApi = async (
    ownerId: OwnerId,
    label: ApiIndexLabel,
    chainId: ChainId,
    provider: string
  ) => {
    // Register a new api index for this instance.
    const index = ApiController.getNextIndex(ownerId);
    setTabApiIndex(ownerId, {
      index,
      label,
    });

    // Set api status to connecting.
    setApiStatus(`${ownerId}_${index}`, 'connecting');

    // Add api to chain space instance.
    await globalChainSpace.getInstance().addApi(ownerId, chainId, provider);
  };

  // Handle incoming api status updates.
  const handleNewApiStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { ownerId, instanceId, chainId, event } =
        e.detail as APIStatusEventDetail;

      switch (event) {
        case 'ready':
          setApiStatus(instanceId, 'ready');

          // Initialise block number subscription.
          SubscriptionsController.set(
            instanceId,
            'blockNumber',
            new BlockNumber(ownerId, instanceId, chainId)
          );

          // Initialise account balance subscriptions.
          SubscriptionsController.set(
            instanceId,
            'accountBalances',
            new AccountBalances(ownerId, instanceId, chainId)
          );
          break;
        case 'connecting':
          setApiStatus(instanceId, 'connecting');
          break;
        case 'connected':
          setApiStatus(instanceId, 'connected');
          break;
        case 'disconnected':
          handleApiDisconnect(ownerId, instanceId);
          break;
        case 'error':
          handleApiDisconnect(ownerId, instanceId);
          break;
        case 'destroyed':
          handleApiDisconnect(ownerId, instanceId);
          break;
      }
    }
  };

  // Handle incoming chain spec updates.
  const handleNewChainSpec = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { instanceId, ownerId, spec, consts } = e.detail;

      const updated = { ...chainSpecsRef.current };
      updated[instanceId] = { ...spec, consts };
      setChainSpecs(updated);

      // NOTE: This is only used for `chainExplorer` task. Could be optimised.
      fetchPalletVersions(
        ownerId,
        spec.metadata,
        ApiController.getInstanceApi(
          ownerId,
          getIndexFromInstanceId(instanceId)
        )
      );
    }
  };

  // Handle a chain disconnect.
  const handleApiDisconnect = async (
    ownerId: OwnerId,
    instanceId: ApiInstanceId,
    destroy = false
  ) => {
    const index = getIndexFromInstanceId(instanceId);

    if (destroy) {
      // Destory api instances associated with this owner.
      ApiController.destroy(ownerId, index);

      // Remove api instance index from indexer.
      removeTabApiIndex(ownerId, index);

      // Remove api status.
      removeApiStatus(instanceId);

      // Remove chain spec.
      removeChainSpec(instanceId);

      // Remove pallet versions.
      removePalletVersions(ownerId);

      // Reset active task.
      resetTabActiveTask(ownerIdToTabId(ownerId));
    } else {
      // Set api status to disconnected.
      setApiStatus(instanceId, 'disconnected');
    }
  };

  // Destroy state associated with an owner. Should only be used on tab close and tab disconnect.
  const destroyAllApiInstances = (ownerId: OwnerId) => {
    const indexes = getTabApiIndexes(ownerId);
    if (indexes.length) {
      for (const apiIndex of indexes) {
        const instanceId = `${ownerId}_${apiIndex.index}`;

        // Destroy transaction metadata associated with this instance.
        destroyInstanceTxMeta(instanceId);

        // Disconnect from API.
        handleApiDisconnect(ownerId, instanceId, true);
      }
    }
  };

  // Get index from instance id.
  const getIndexFromInstanceId = (instanceId: string): number => {
    // NOTE: assumes instanceId is in the format `ownerId_index`. E.g. `tab_0_1`.
    const result = instanceId.split('_');
    return Number(result[2]);
  };

  // Destroy an api instance given a tab and label.
  const destroyApiInstance = (ownerId: OwnerId, label: ApiIndexLabel) => {
    const apiIndex = getTabApiIndex(ownerId, label);
    if (apiIndex !== undefined) {
      // Destory the API instance.
      ApiController.destroy(ownerId, apiIndex.index);

      // Remove from api indexer.
      removeTabApiIndex(ownerId, apiIndex.index);
    }
  };

  // Instantiate an Api instances from tab task data.
  const instantiateApiFromTab = async (tabId: number) => {
    const activeTask = getTabActiveTask(tabId);
    const taskData = getTabTaskData(tabId);

    // All tasks require a `chain` and `autoConnect` property to instantiate.
    if (activeTask && taskData?.chain && taskData?.autoConnect) {
      handleConnectApi(
        tabIdToOwnerId(tabId),
        activeTask,
        taskData.chain.id,
        taskData.chain.endpoint
      );
    }
  };

  // Handle fetching of pallet versions.
  const fetchPalletVersions = async (
    ownerId: OwnerId,
    metadata: MetadataVersion,
    apiInstance: ApiPromise
  ) => {
    // Exit if pallet versions have already been fetched.
    if (palletVersions[ownerId] !== undefined) {
      return;
    }
    // Get pallet list from scraper.
    const scraper = new PalletScraper(metadata);
    const pallets = scraper.getPalletList();

    // Map through pallets and set up an array of calls to query the RPC with.
    const calls = pallets.map(({ name }) => {
      const storageKey =
        xxhashAsHex(name, 128) +
        xxhashAsHex(':__STORAGE_VERSION__:', 128).slice(2);
      return apiInstance.rpc.state.getStorage(storageKey);
    });

    const result = await Promise.all(calls);

    const newPalletVersions = Object.fromEntries(
      result.map((element: AnyJson, index: number) => {
        // Empty return types can be assumed to be version 0.
        const versionAsHex = element.toHex();
        return [
          pallets[index].name,
          versionAsHex == '0x' ? '0' : String(u16.dec(element.toString())),
        ];
      })
    );

    // Set pallet version state for the provided tab.
    setPalletVersions((prev) => ({
      ...prev,
      [ownerId]: newPalletVersions,
    }));
  };

  // Get whether all tab chains are connected.
  const allActiveChainsConnected = (): boolean => {
    const tabChainIds = getActiveTaskChainIds();
    const connectedChains = getConnectedChains();
    const connectedChainIds = new Set(
      connectedChains.map((chain) => chain.specName)
    );
    return eqSet(tabChainIds, connectedChainIds);
  };

  // Get pallet versions by tab Id.
  const getPalletVersions = (
    ownerId: OwnerId
  ): Record<string, string> | undefined => palletVersions[ownerId];

  // Initialisation of Apis.
  useEffect(() => {
    // Instantiate Api instances from tabs.
    tabs.forEach((tab) => {
      if (tab.taskData?.autoConnect) {
        instantiateApiFromTab(tab.id);
      }
    });
  }, []);

  const documentRef = useRef<Document>(document);

  // Listen for api status updates.
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Listen for new chain spec updates.
  useEventListener('new-chain-spec', handleNewChainSpec, documentRef);

  return (
    <ChainSpaceEnv.Provider
      value={{
        // Getters
        getApiStatus,
        getChainSpec,
        getApiInstanceById,
        getApiInstance,
        getPalletVersions,
        getConnectedChains,
        getChainIdCaip,

        // Connect and Disconnect
        handleConnectApi,
        instantiateApiFromTab,
        destroyApiInstance,
        destroyAllApiInstances,

        // Sync states
        allActiveChainsConnected,
      }}
    >
      {children}
    </ChainSpaceEnv.Provider>
  );
};
