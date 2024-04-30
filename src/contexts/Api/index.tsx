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
  ApiStatus,
  ApiStatusState,
  ChainSpecState,
  ErrDetail,
} from 'model/Api/types';
import { useChainUi } from 'contexts/ChainUi';
import { NotificationsController } from 'controllers/Notifications';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { BlockNumber } from 'model/BlockNumber';
import { AccountBalances } from 'model/AccountBalances';
import { setStateWithRef } from '@w3ux/utils';

export const Api = createContext<ApiContextInterface>(defaultApiContext);

export const useApi = () => useContext(Api);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { fetchPalletVersions } = useChainUi();
  const {
    tabs,
    getActiveTab,
    forgetTabChain,
    instantiateApiFromTab,
    setTabForceDisconnect,
  } = useTabs();

  // Store API connection status of each api instance. NOTE: requires ref as it is used in event
  // listener.
  const [apiStatus, setApiStatusState] = useState<ApiStatusState>({});
  const apiStatusRef = useRef(apiStatus);

  /*
    tab_1: 'connecting',
    coretime_1: 'connected',
    coretime_2: 'ready',
  */

  // Setter for api status. Updates state and ref.
  const setApiStatus = (status: Record<number, ApiStatus>) => {
    setStateWithRef(status, setApiStatusState, apiStatusRef);
  };

  // Store chain spec of each api instance. NOTE: requires ref as it is used in event listener.
  const [chainSpec, setChainSpecState] = useState<ChainSpecState>({});
  const chainSpecRef = useRef(chainSpec);

  // Setter for chain spec. Updates state and ref.
  const setChainSpec = (status: Record<number, APIChainSpec>) => {
    setStateWithRef(status, setChainSpecState, chainSpecRef);
  };

  // Remove api status for an owner.
  const removeApiStatus = (tabId: number) => {
    const updated = { ...apiStatusRef.current };
    delete updated[tabId];
    setApiStatus(updated);
  };

  // Remove tab chain spec.
  const removeChainSpec = (tabId: number) => {
    const updated = { ...chainSpecRef.current };
    delete updated[tabId];
    setChainSpec(updated);
  };

  // Gets an api status based on a tab id.
  const getApiStatus = (tabId: number): ApiStatus => apiStatus[tabId];

  // Gets whether an api is active (not disconnected or undefined).
  const getApiActive = (tabId: number): boolean => {
    const status = getApiStatus(tabId);
    return (
      status === 'ready' || status === 'connected' || status === 'connecting'
    );
  };

  // Gets a chain spec based on a tab id.
  const getChainSpec = (tabId: number): APIChainSpec => chainSpec[tabId];

  // Gets the `Api` instance of the active tab, if present.
  const getTabApi = () => {
    const activeTab = getActiveTab();
    if (activeTab?.chain) {
      return ApiController.instances[activeTab.id];
    }
  };

  // Handle a chain disconnect.
  const handleDisconnect = (tabId: number, destroy = false) => {
    if (destroy) {
      removeApiStatus(tabId);
      removeChainSpec(tabId);
    } else {
      // Update API status to `disconnected`.
      setApiStatus({ ...apiStatusRef.current, [tabId]: 'disconnected' });
    }
  };

  // Handle a chain error.
  const handleChainError = (tabId: number, err?: ErrDetail) => {
    removeApiStatus(tabId);
    removeChainSpec(tabId);

    // If the error originated from initialization or bootstrapping of metadata, assume the
    // connection is an invalid chain and forget it. This prevents auto connect on subsequent
    // visits.
    if (err && ['InitializationError', 'ChainSpecError'].includes(err)) {
      forgetTabChain(tabId);
      setTabForceDisconnect(tabId, true);

      NotificationsController.emit({
        title: 'Error Initializing Chain',
        subtitle: `Failed to initialize the chain.`,
      });
    }
  };

  // Handle incoming api status updates.
  const handleNewApiStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { tabId, chainId, event, err } = e.detail as APIStatusEventDetail;

      switch (event) {
        case 'ready':
          setApiStatus({
            ...apiStatusRef.current,
            [tabId]: 'ready',
          });

          // Initialise subscriptions for Overview here. We are currently only subscribing to the
          // block number. NOTE: SubscriptionsController is currently only assuming one `chainId`
          // per tab. This needs to change for parachain setup. TODO: SubscriptionsController to
          // handle multiple chainIds per tab.
          SubscriptionsController.set(
            tabId,
            'blockNumber',
            new BlockNumber(tabId, chainId)
          );

          // Initialise account balance subscriptions.
          SubscriptionsController.set(
            tabId,
            'accountBalances',
            new AccountBalances(tabId, chainId)
          );

          break;
        case 'connecting':
          setApiStatus({ ...apiStatusRef.current, [tabId]: 'connecting' });
          break;
        case 'connected':
          setApiStatus({ ...apiStatusRef.current, [tabId]: 'connected' });
          break;
        case 'disconnected':
          handleDisconnect(tabId);
          break;
        case 'error':
          handleChainError(tabId, err);
          break;
        case 'destroyed':
          handleDisconnect(tabId, true);
          break;
      }
    }
  };

  // Handle incoming chain spec updates.
  const handleNewChainSpec = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { ownerId, spec, consts } = e.detail;

      setChainSpec({
        ...chainSpecRef.current,
        [ownerId]: { ...spec, consts },
      });

      // Fetch pallet versions for ChainUi state.
      fetchPalletVersions(
        ownerId,
        spec.metadata,
        ApiController.instances[ownerId].api
      );
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
      if (tab.autoConnect) {
        instantiateApiFromTab(tab.id);
      }
    });
  }, []);

  return (
    <Api.Provider
      value={{
        getApiStatus,
        getApiActive,
        getTabApi,
        getChainSpec,
      }}
    >
      {children}
    </Api.Provider>
  );
};
