// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { defaultApiContext } from './defaults';
import type { ApiContextInterface } from './types';
import { ApiController } from 'controllers/Api';
import { useTabs } from 'contexts/Tabs';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import type {
  APIChainSpec,
  APIStatusEventDetail,
  ApiInstanceId,
  ApiStatus,
  ApiStatusState,
  ChainSpecState,
} from 'model/Api/types';
import { useChainUi } from 'contexts/ChainUi';
import { NotificationsController } from 'controllers/Notifications';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { BlockNumber } from 'model/BlockNumber';
import { AccountBalances } from 'model/AccountBalances';
import { setStateWithRef } from '@w3ux/utils';
import { ownerIdToTabId } from 'contexts/Tabs/Utils';
import { getIndexFromInstanceId } from 'model/Api/util';
import type { OwnerId } from 'types';
import { useChainBrowser } from 'contexts/ChainBrowser';

export const Api = createContext<ApiContextInterface>(defaultApiContext);

export const useApi = () => useContext(Api);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { fetchPalletVersions } = useChainUi();
  const { tabs, setTabActiveTask } = useTabs();
  const { instantiateApiFromTab, forgetTabChain } = useChainBrowser();

  // Store API connection status of each api instance. NOTE: requires ref as it is used in event
  // listener.
  const [apiStatus, setApiStatusState] = useState<ApiStatusState>({});
  const apiStatusRef = useRef(apiStatus);

  // Setter for api status. Updates state and ref.
  const setApiStatus = (newApiStatus: ApiStatusState) => {
    setStateWithRef(newApiStatus, setApiStatusState, apiStatusRef);
  };

  // Store chain spec of each api instance. NOTE: requires ref as it is used in event listener.
  const [chainSpec, setChainSpecState] = useState<ChainSpecState>({});
  const chainSpecRef = useRef(chainSpec);

  // Setter for chain spec. Updates state and ref.
  const setChainSpec = (newChainSpec: ChainSpecState) => {
    setStateWithRef(newChainSpec, setChainSpecState, chainSpecRef);
  };

  // Remove api status for an instance.
  const removeApiStatus = (instanceId: ApiInstanceId) => {
    const updated = { ...apiStatusRef.current };
    delete updated[instanceId];
    setApiStatus(updated);
  };

  // Remove chain spec for an owner.
  const removeChainSpec = (instanceId: ApiInstanceId) => {
    const updated = { ...chainSpecRef.current };
    delete updated[instanceId];
    setChainSpec(updated);
  };

  // Gets an api status, keyed by owner.
  const getApiStatus = (instanceId: ApiInstanceId): ApiStatus =>
    apiStatus?.[instanceId] || 'disconnected';

  // Gets whether an api is active (not disconnected or undefined).
  const getApiActive = (instanceId: ApiInstanceId): boolean => {
    const status = getApiStatus(instanceId);
    return (
      status === 'ready' || status === 'connected' || status === 'connecting'
    );
  };

  // Gets a chain spec, keyed by owner.
  const getChainSpec = (instanceId: ApiInstanceId): APIChainSpec =>
    chainSpec[instanceId];

  // Handle a chain disconnect.
  const handleDisconnect = (instanceId: ApiInstanceId, destroy = false) => {
    if (destroy) {
      removeApiStatus(instanceId);
      removeChainSpec(instanceId);
    } else {
      // Update API status to `disconnected`.
      setApiStatus({ ...apiStatusRef.current, [instanceId]: 'disconnected' });
    }
    // Remove tab's activeTask.
    setTabActiveTask(ownerIdToTabId(instanceId), null);
  };

  // Handle a chain error.
  const handleChainError = (ownerId: OwnerId, instanceId: ApiInstanceId) => {
    removeApiStatus(instanceId);
    removeChainSpec(instanceId);

    // If the error originated from initialization or bootstrapping of metadata, assume the
    // connection is an invalid chain and forget it. This prevents auto connect on subsequent
    // visits.

    // If this owner is a tab, disconnect and forget the chain.
    if (ownerId.startsWith('tab_')) {
      // NOTE: this will no longer destroy the api instance.
      forgetTabChain(ownerIdToTabId(ownerId));
    }
    NotificationsController.emit({
      title: 'Error Initializing Chain',
      subtitle: `Failed to initialize the chain.`,
    });
  };

  // Handle incoming api status updates.
  const handleNewApiStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { ownerId, instanceId, chainId, event } =
        e.detail as APIStatusEventDetail;

      switch (event) {
        case 'ready':
          setApiStatus({
            ...apiStatusRef.current,
            [instanceId]: 'ready',
          });

          // Initialise subscriptions for Overview here. We are currently only subscribing to the
          // block number.
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
          setApiStatus({ ...apiStatusRef.current, [instanceId]: 'connecting' });
          break;
        case 'connected':
          setApiStatus({ ...apiStatusRef.current, [instanceId]: 'connected' });
          break;
        case 'disconnected':
          handleDisconnect(instanceId);
          break;
        case 'error':
          handleChainError(ownerId, instanceId);
          break;
        case 'destroyed':
          handleDisconnect(instanceId, true);
          break;
      }
    }
  };

  // Handle incoming chain spec updates.
  const handleNewChainSpec = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { ownerId, instanceId, spec, consts } = e.detail;

      setChainSpec({
        ...chainSpecRef.current,
        [instanceId]: { ...spec, consts },
      });

      // Fetch pallet versions for ChainUi state if this is a tab api instance.
      if (ownerId.startsWith('tab_')) {
        fetchPalletVersions(
          ownerId,
          spec.metadata,
          ApiController.getInstanceApi(
            ownerId,
            getIndexFromInstanceId(instanceId)
          )
        );
      }
    }
  };

  const documentRef = useRef<Document>(document);

  // Listen for api status updates.
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Listen for new chain spec updates.
  useEventListener('new-chain-spec', handleNewChainSpec, documentRef);

  // Initialisation of Api.
  useEffect(() => {
    // Instantiate Api instances from tabs.
    tabs.forEach((tab) => {
      if (tab.taskData?.autoConnect) {
        instantiateApiFromTab(tab.id);
      }
    });
  }, []);

  return (
    <Api.Provider
      value={{
        getApiStatus,
        getApiActive,
        getChainSpec,
      }}
    >
      {children}
    </Api.Provider>
  );
};
