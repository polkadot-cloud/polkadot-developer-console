// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import { isCustomEvent } from 'Utils';
import { SubscriptionsController } from 'controllers/Subscriptions';
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
import { ApiController } from 'controllers/Api';
import { BlockNumber } from 'model/BlockNumber';
import { useApiIndexer } from 'contexts/ApiIndexer';
import type { OwnerId } from 'types';
import { useChainUi } from 'contexts/ChainUi';
import { useTabs } from 'contexts/Tabs';
import { ownerIdToTabId } from 'contexts/Tabs/Utils';
import type { ApiIndexLabel } from 'contexts/ApiIndexer/types';

export const ChainSpaceEnv = createContext<ChainSpaceEnvContextInterface>(
  defaultChainSpaceEnvContext
);

export const useChainSpaceEnv = () => useContext(ChainSpaceEnv);

export const ChainSpaceEnvProvider = ({ children }: ChainSpaceEnvProps) => {
  const {
    getTabApiIndex,
    setTabApiIndex,
    getTabApiIndexes,
    removeTabApiIndex,
  } = useApiIndexer();
  const { resetTabActiveTask } = useTabs();
  const { fetchPalletVersions } = useChainUi();
  const { globalChainSpace } = useGlobalChainSpace();

  // The chain spec of each api instance associated with this chain space. NOTE: Requires ref as it
  // is used in event listener.
  const [chainSpecs, setChainSpecsState] = useState<ChainSpaceChainSpecs>({});
  const chainSpecsRef = useRef(chainSpecs);

  // The API status of the api instances associated with this chain space. NOTE: Requires ref as it
  // is used in event listener.
  const [apiStatuses, setApiStatuses] = useState<ChainSpaceApiStatuses>({});
  const apiStatusesRef = useRef(apiStatuses);

  // Gets an api instance tab and label.
  const getApiInstance = (ownerId: OwnerId, label: ApiIndexLabel) => {
    const apiIndex = getTabApiIndex(ownerId, label);
    if (apiIndex !== undefined) {
      return ApiController.instances[ownerId]?.[apiIndex.index];
    }
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

  // Get chainSpec for a chain instance by index.
  const getChainSpec = (instanceId?: ApiInstanceId) => {
    if (instanceId === undefined) {
      return undefined;
    }
    return chainSpecsRef.current[instanceId];
  };

  // Set an api status for a chain instance.
  const setApiStatus = (instanceId: ApiInstanceId, status: ApiStatus) => {
    setStateWithRef(
      {
        ...apiStatusesRef.current,
        [instanceId]: status,
      },
      setApiStatuses,
      apiStatusesRef
    );
  };

  // Setter for chain spec. Updates state and ref.
  const setChainSpecs = (newChainSpec: ChainSpaceChainSpecs) => {
    setStateWithRef(newChainSpec, setChainSpecsState, chainSpecsRef);
  };

  // Get an api status for an instance.
  const getApiStatus = (instanceId?: ApiInstanceId) => {
    if (instanceId === undefined) {
      return 'disconnected';
    }
    return apiStatusesRef.current[instanceId] || 'disconnected';
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
          handleDisconnect(ownerId, instanceId);
          break;
        case 'error':
          handleDisconnect(ownerId, instanceId, true);
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
      const { instanceId, ownerId, spec, consts } = e.detail;

      const updated = { ...chainSpecsRef.current };
      updated[instanceId] = { ...spec, consts };
      setChainSpecs(updated);

      // NOTE: This is only used for `chainBrowser` task. Could be optimised.
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
  const handleDisconnect = async (
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
      const updatedApiStatuses = { ...apiStatusesRef.current };
      delete updatedApiStatuses[instanceId];
      setApiStatuses(updatedApiStatuses);
      apiStatusesRef.current = updatedApiStatuses;

      // Remove chain spec.
      const updatedChainSpecs = { ...chainSpecsRef.current };
      delete updatedChainSpecs[instanceId];
      setChainSpecs(updatedChainSpecs);

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
        handleDisconnect(ownerId, `${ownerId}_${apiIndex.index}`, true);
      }
    }
  };

  // Get index from instance id.
  const getIndexFromInstanceId = (instanceId: string): number => {
    // NOTE: assumes instanceId is in the format `ownerId_index`. E.g. `tab_0_1`.
    const result = instanceId.split('_');
    return Number(result[2]);
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
        getApiStatus,
        getChainSpec,
        getApiInstance,

        // Connect and Disconnect
        handleConnectApi,
        destroyApiInstance,
        destroyAllApiInstances,
      }}
    >
      {children}
    </ChainSpaceEnv.Provider>
  );
};
