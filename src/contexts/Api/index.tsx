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
import { NetworkDirectory } from 'config/networks';
import { setStateWithRef } from '@w3ux/utils';

export const Api = createContext<ApiContextInterface>(defaultApiContext);

export const useApi = () => useContext(Api);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { getActiveTab, tabs } = useTabs();

  // Store API connection status of each tab. NOTE: requires ref as it is used in event listener.
  const [apiStatus, setApiStatusState] = useState<Record<number, ApiStatus>>(
    {}
  );
  const apiStatusRef = useRef(apiStatus);

  // Store chain spec of each tab. NOTE: requires ref as it is used in event listener.
  const [chainSpec, setChainSpec] = useState<Record<number, APIChainSpec>>({});
  const chainSpecRef = useRef(chainSpec);

  // Setter for api status.
  const setApiStatus = (status: Record<number, ApiStatus>) => {
    apiStatusRef.current = status;
    setApiStatusState(status);
  };

  // Remove api status on tab close.
  const removeApiStatus = (tabId: number) => {
    const newApiStatus = { ...apiStatusRef.current };
    delete newApiStatus[tabId];
    setApiStatus(newApiStatus);
  };

  // Gets an api status based on a tab id.
  const getApiStatus = (tabId: number): ApiStatus => apiStatus[tabId];

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
  const handleDisconnect = (tabId: number) => {
    // Delete api status for the tab.
    const newApiStatus = { ...apiStatusRef.current };
    delete newApiStatus[tabId];
    setApiStatus(newApiStatus);

    // Delete chain spec for the tab.
    const newChainSpec = { ...chainSpecRef.current };
    delete newChainSpec[tabId];
    setStateWithRef(newChainSpec, setChainSpec, chainSpecRef);
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
          handleDisconnect(tabId);
          break;
        case 'destroyed':
          removeApiStatus(tabId);
          break;
      }
    }
  };

  // Handle incoming chain spec updates.
  const handleNewChainSpec = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { tabId, spec } = e.detail;

      setStateWithRef(
        {
          ...chainSpecRef.current,
          [tabId]: spec,
        },
        setChainSpec,
        chainSpecRef
      );
    }
  };

  const documentRef = useRef<Document>(document);

  // Listen for api status updates.
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Listen for new chain spec updates.
  useEventListener('new-chain-spec', handleNewChainSpec, documentRef);

  // Initialisation of Api instances.
  useEffect(() => {
    tabs.forEach((tab) => {
      if (tab?.chain && tab.autoConnect) {
        const { id, provider } = tab.chain;

        const endpoint = NetworkDirectory[id].providers[provider];
        ApiController.instantiate(tab.id, id, endpoint);
      }
    });
  }, []);

  return (
    <Api.Provider
      value={{
        isReady: false,
        getApiStatus,
        getTabApi,
        getChainSpec,
      }}
    >
      {children}
    </Api.Provider>
  );
};
