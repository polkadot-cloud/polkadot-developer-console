// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import { isCustomEvent } from 'Utils';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { useActiveBalances } from 'hooks/useActiveBalances';
import { AccountBalances } from 'model/AccountBalances';
import type {
  APIStatusEventDetail,
  ApiInstanceId,
  ApiStatus,
} from 'model/Api/types';
import { createContext, useContext, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import type {
  ChainSpaceApiStatuses,
  ChainSpaceChainSpecs,
  ChainSpaceEnvContextInterface,
  ChainSpaceEnvProps,
} from './types';
import { defaultChainSpaceEnvContext } from './defaults';
import { useGlobalChainSpace } from 'contexts/GlobalChainSpace';
import type { ChainId } from 'config/networks';
import type { ActiveBalancesProps } from 'hooks/useActiveBalances/types';
import { ApiController } from 'controllers/Api';
import { BlockNumber } from 'model/BlockNumber';
import { useApiIndexer } from 'contexts/ApiIndexer';
import { useActiveTab } from 'contexts/ActiveTab';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';
import type { OwnerId } from 'types';

export const ChainSpaceEnv = createContext<ChainSpaceEnvContextInterface>(
  defaultChainSpaceEnvContext
);

export const useChainSpaceEnv = () => useContext(ChainSpaceEnv);

export const ChainSpaceEnvProvider = ({ children }: ChainSpaceEnvProps) => {
  const { tabId: activeTabId, ownerId: activeOwnerId } = useActiveTab();
  const { getAccounts } = useImportedAccounts();
  const { globalChainSpace } = useGlobalChainSpace();
  const {
    getTabApiIndex,
    setTabApiIndex,
    removeTabApiIndex,
    getTabApiIndexes,
  } = useApiIndexer();

  // The chain spec of each api instance associated with this chain space. NOTE: Requires ref as it
  // is used in event listener.
  const [chainSpecs, setChainSpecsState] = useState<ChainSpaceChainSpecs>({});
  const chainSpecsRef = useRef(chainSpecs);

  // The API status of the api instances associated with this chain space. NOTE: Requires ref as it
  // is used in event listener.
  const [apiStatuses, setApiStatuses] = useState<ChainSpaceApiStatuses>({});
  const apiStatusesRef = useRef(apiStatuses);

  // Gets an api instance tab and label.
  const getChainApi = (tabId: number, label: string) => {
    const apiIndex = getTabApiIndex(tabId, label);
    if (apiIndex !== undefined) {
      return ApiController.instances[tabIdToOwnerId(tabId)]?.[apiIndex.index];
    }
  };

  // Destroy an api instance given a tab and label.
  const destroyChainApi = (tabId: number, label: string) => {
    const apiIndex = getTabApiIndex(tabId, label);
    if (apiIndex !== undefined) {
      // Destory the API instance.
      ApiController.destroy(tabIdToOwnerId(tabId), apiIndex.index);

      // Remove from api indexer.
      removeTabApiIndex(tabId, label);
    }
  };

  // Destroy all api instances associated with a tab.
  const destroyAllChainApis = (tabId: number) => {
    const ownerId = tabIdToOwnerId(tabId);
    ApiController.destroyAll(ownerId);
  };

  // Get an api status for an instance by index.
  const getApiStatusByIndex = (tabId: number, index: number | undefined) => {
    if (index === undefined) {
      return 'disconnected';
    }
    const instanceId = `${tabIdToOwnerId(tabId)}_${index}`;
    return apiStatusesRef.current[instanceId] || 'disconnected';
  };

  // Get chainSpec for a chain instance by index.
  const getChainSpecByIndex = (tabId: number, index: number | undefined) => {
    if (index === undefined) {
      return undefined;
    }
    const instanceId = `${tabIdToOwnerId(tabId)}_${index}`;
    return chainSpecsRef.current[instanceId];
  };

  // Setter for chain spec. Updates state and ref.
  const setChainSpecs = (newChainSpec: ChainSpaceChainSpecs) => {
    setStateWithRef(newChainSpec, setChainSpecsState, chainSpecsRef);
  };

  // Set an api status for a chain instance.
  const setApiStatus = (instanceId: string, status: ApiStatus) => {
    setStateWithRef(
      {
        ...apiStatusesRef.current,
        [instanceId]: status,
      },
      setApiStatuses,
      apiStatusesRef
    );
  };

  // Gets whether an api is active (not disconnected or undefined).
  const getApiActive = (tabId: number, label: string): boolean => {
    const apiIndex = getTabApiIndex(tabId, label);
    const status = getApiStatusByIndex(tabId, apiIndex?.index);
    return (
      status === 'ready' || status === 'connected' || status === 'connecting'
    );
  };

  // Handle connecting to an api instance.
  const handleConnectApi = async (
    tabId: number,
    label: string,
    chainId: ChainId,
    provider: string
  ) => {
    // Register a new api index for this instance.
    const index = ApiController.getNextIndex(tabIdToOwnerId(tabId));
    setTabApiIndex(tabId, {
      index,
      label,
    });

    // Set api status to connecting.
    setApiStatus(`${tabIdToOwnerId(tabId)}_${index}`, 'connecting');

    // Add api to chain space instance.
    await globalChainSpace
      .getInstance()
      .addApi(tabIdToOwnerId(tabId), chainId, provider);
  };

  // Accumulate active balance configuration from api indexes for the current tab.
  const activeBalanceInstances: ActiveBalancesProps = {};
  Object.values(getTabApiIndexes(activeTabId)).forEach(({ index }) => {
    const instanceId = `${activeOwnerId}_${index}`;
    const chainSpec = chainSpecs[instanceId];

    const accounts =
      chainSpec && chainSpec.chain
        ? getAccounts(chainSpec.chain, chainSpec.ss58Prefix)
        : [];

    if (chainSpecs[instanceId]) {
      activeBalanceInstances[instanceId] = {
        accounts: accounts.map(({ address }) => address),
        apiStatus: apiStatuses[instanceId] || 'disconnected',
      };
    }
  });

  // Get active account balances.
  const activeBalances = useActiveBalances(activeBalanceInstances);

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
          handleDisconnect(ownerId, instanceId);
          break;
        case 'error':
          // TODO: Check how this behaves with invalid custom websocket.
          handleDisconnect(ownerId, instanceId);
          break;
        case 'destroyed':
          handleDisconnect(ownerId, instanceId);
          break;
      }
    }
  };

  // Handle incoming chain spec updates.
  const handleNewChainSpec = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { instanceId, spec, consts } = e.detail;

      const updated = { ...chainSpecsRef.current };
      updated[instanceId] = { ...spec, consts };
      setChainSpecs(updated);

      // TODO: Find a way to fetch pallet versions once chainSpec is updated.
    }
  };

  // Handle a chain disconnect.
  const handleDisconnect = async (
    ownerId: OwnerId,
    instanceId: ApiInstanceId
  ) => {
    const index = getIndexFromInstanceId(instanceId);

    await ApiController.destroy(ownerId, index);

    // TODO: remove Api index from indexer.

    const updatedApiStatuses = { ...apiStatusesRef.current };
    delete updatedApiStatuses[instanceId];
    setApiStatuses(updatedApiStatuses);
    apiStatusesRef.current = updatedApiStatuses;

    const updatedChainSpecs = { ...chainSpecsRef.current };
    delete updatedChainSpecs[instanceId];
    setChainSpecs(updatedChainSpecs);
  };

  // Destroy state associated with a tab. Should only be used on tab close.
  const destroyChainSpaceEnvIndex = (tabId: number, index: number) => {
    // Disconnect from all instances associated with this tab.
    const instanceId = `${tabIdToOwnerId(tabId)}_${index}`;
    handleDisconnect(tabIdToOwnerId(tabId), instanceId);
  };

  // Get index from instance id.
  const getIndexFromInstanceId = (instanceId: string): number => {
    const result = instanceId.split(/_(.*)/s);
    return Number(result[1]);
  };

  const documentRef = useRef<Document>(document);

  // Listen for api status updates.
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Listen for new chain spec updates.
  useEventListener('new-chain-spec', handleNewChainSpec, documentRef);

  return (
    <ChainSpaceEnv.Provider
      value={{
        // Getters
        getApiStatusByIndex,
        getApiActive,
        getChainSpecByIndex,
        getChainApi,

        // Balances
        activeBalances,

        // Connect and Disconnect
        handleConnectApi,
        destroyChainApi,
        destroyAllChainApis,
        destroyChainSpaceEnvIndex,
      }}
    >
      {children}
    </ChainSpaceEnv.Provider>
  );
};
