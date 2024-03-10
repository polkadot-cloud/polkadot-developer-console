// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { defaultApiContext } from './defaults';
import type { ApiContextInterface } from './types';
import { ApiController } from 'controllers/ApiController';
import { useTabs } from 'contexts/Tabs';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import type { APIChainSpec, ApiStatus } from 'model/Api/types';
import { OnlineStatusController } from 'controllers/OnlineStatusController';

export const Api = createContext<ApiContextInterface>(defaultApiContext);

export const useApi = () => useContext(Api);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { getActiveTab, tabs, instantiateApiFromTab, forgetTabChain } =
    useTabs();

  // Whether the app is offline.
  const [offline, setOffline] = useState(false);

  // Store API connection status of each tab. NOTE: requires ref as it is used in event listener.
  const [apiStatus, setApiStatusState] = useState<Record<number, ApiStatus>>(
    {}
  );
  const apiStatusRef = useRef(apiStatus);

  // Store chain spec of each tab. NOTE: requires ref as it is used in event listener.
  const [chainSpec, setChainSpecState] = useState<Record<number, APIChainSpec>>(
    {}
  );
  const chainSpecRef = useRef(chainSpec);

  // Setter for api status.
  const setApiStatus = (status: Record<number, ApiStatus>) => {
    apiStatusRef.current = status;
    setApiStatusState(status);
  };

  // Setter for chain spec.
  const setChainSpec = (status: Record<number, APIChainSpec>) => {
    chainSpecRef.current = status;
    setChainSpecState(status);
  };

  // Remove tab api status.
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
  const handleChainError = (tabId: number) => {
    removeApiStatus(tabId);
    removeChainSpec(tabId);
    forgetTabChain(tabId);
  };

  // Handle incoming online status updates.
  const handleOnlineStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { online } = e.detail;
      setOffline(!online);
    }
  };
  // Handle incoming api status updates.
  const handleNewApiStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { tabId, event } = e.detail;

      switch (event) {
        case 'ready':
          setApiStatus({
            ...apiStatusRef.current,
            [tabId]: 'ready',
          });
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
          handleChainError(tabId);
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
      const { tabId, spec } = e.detail;

      setChainSpec({
        ...chainSpecRef.current,
        [tabId]: spec,
      });
    }
  };

  const documentRef = useRef<Document>(document);

  // Listen for online status updates.
  useEventListener('online-status', handleOnlineStatus, documentRef);

  // Listen for api status updates.
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Listen for new chain spec updates.
  useEventListener('new-chain-spec', handleNewChainSpec, documentRef);

  // Initialisation of Api.
  useEffect(() => {
    // Start listening for online / offline events.
    OnlineStatusController.initOnlineEvents();

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
        offline,
        isReady: false,
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
