// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import { isCustomEvent } from 'Utils';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useMenu } from 'contexts/Menu';
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

export const ChainSpaceEnv = createContext<ChainSpaceEnvContextInterface>(
  defaultChainSpaceEnvContext
);

export const useChainSpaceEnv = () => useContext(ChainSpaceEnv);

export const ChainSpaceEnvProvider = ({ children }: ChainSpaceEnvProps) => {
  const { closeMenu } = useMenu();
  const { getAccounts } = useImportedAccounts();
  const { globalChainSpace } = useGlobalChainSpace();

  // The api instance index associated with this chainspace, keyed by a global index.
  const [apiIndexes, setApiIndexes] = useState<Record<number, number>>({});
  const apiIndexesRef = useRef(apiIndexes);

  // Store chain spec of each api instance. NOTE: requires ref as it is used in event listener.
  const [chainSpecs, setChainSpecsState] = useState<ChainSpaceChainSpecs>({});
  const chainSpecsRef = useRef(chainSpecs);

  // The API status of the relay chain. NOTE: requires ref as it is used in event listener.
  const [apiStatuses, setApiStatuses] = useState<ChainSpaceApiStatuses>({});
  const apiStatusesRef = useRef(apiStatuses);

  // Gets a api instance from an index.
  const getChainApi = (index: number | undefined) => {
    if (index === undefined) {
      return undefined;
    }
    const instanceIndex = apiIndexes[index];
    return ApiController.instances[globalChainSpace.ownerId]?.[instanceIndex];
  };

  // Destroy a chain api instance.
  const destroyChainApi = (index: number) => {
    const instanceIndex = apiIndexes[index];
    ApiController.destroy(globalChainSpace.ownerId, instanceIndex);
  };

  // Get an api status for a chain instance.
  const getApiStatusByIndex = (index: number | undefined) => {
    if (index === undefined) {
      return 'disconnected';
    }

    const instanceId = `${globalChainSpace?.ownerId}_${index}`;
    return apiStatusesRef.current[instanceId] || 'disconnected';
  };

  // Sets a chain id at an index.
  const setApiIndex = (index: number, instanceId: number) => {
    setStateWithRef(
      {
        ...apiIndexesRef.current,
        [index]: instanceId,
      },
      setApiIndexes,
      apiIndexesRef
    );
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

  // Handle connecting to an api instance.
  const handleConnectApi = async (chainId: ChainId, provider: string) => {
    closeMenu();

    // Determine this api index.
    const index = getNextApiIndex();

    // Record this api instance.
    setApiIndex(index, ApiController.getNextIndex(globalChainSpace.ownerId));
    setApiStatus(`${globalChainSpace.ownerId}_${index}`, 'connecting');

    // Add api to chain space instance and return its instance id.
    await globalChainSpace.getInstance().addApi(chainId, provider);

    return index;
  };

  // Accumulate active balance instances.
  const activeBalanceInstances: ActiveBalancesProps = {};

  Object.values(apiIndexesRef.current).forEach((indexId: number) => {
    const instanceId = `global_${indexId}`;
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

      // Ensure we are handling the correct api instance here.
      if (ownerId === globalChainSpace?.ownerId) {
        switch (event) {
          case 'ready':
            setApiStatus(instanceId, 'ready');

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
            handleDisconnect(instanceId);
            break;
          case 'error':
            handleDisconnect(instanceId);
            break;
          case 'destroyed':
            handleDisconnect(instanceId);
            break;
        }
      }
    }
  };

  // Handle incoming chain spec updates.
  const handleNewChainSpec = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { instanceId, ownerId, spec, consts } = e.detail;
      if (ownerId === globalChainSpace?.ownerId) {
        const updated = { ...chainSpecsRef.current };
        updated[instanceId] = { ...spec, consts };

        setChainSpecs(updated);
      }
    }
  };

  // Handle a chain disconnect.
  const handleDisconnect = async (instanceId: ApiInstanceId) => {
    const index = getIndexFromInstanceId(instanceId);

    await ApiController.destroy(globalChainSpace.ownerId, index);

    const updatedApiIndexes = { ...apiIndexesRef.current };
    delete updatedApiIndexes[index];
    setApiIndexes(updatedApiIndexes);
    apiIndexesRef.current = updatedApiIndexes;

    const updatedApiStatuses = { ...apiStatusesRef.current };
    delete updatedApiStatuses[instanceId];
    setApiStatuses(updatedApiStatuses);
    apiStatusesRef.current = updatedApiStatuses;

    const updatedChainSpecs = { ...chainSpecsRef.current };
    delete updatedChainSpecs[instanceId];
    setChainSpecs(updatedChainSpecs);
  };

  // Get next available index for apiIndexes.
  const getNextApiIndex = () => {
    // Initialise empty record for this ownerId if it doesn't exist.
    if (!Object.keys(apiIndexes).length) {
      return 0;
    } else {
      // Get largest index and increment it.
      return (
        Object.keys(Object.keys(apiIndexes) || {}).reduce(
          (acc, id) => Math.max(acc, parseInt(id, acc)),
          0
        ) + 1
      );
    }
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
        activeBalances,
        handleConnectApi,
        getChainApi,
        destroyChainApi,
        getApiStatusByIndex,
      }}
    >
      {children}
    </ChainSpaceEnv.Provider>
  );
};
