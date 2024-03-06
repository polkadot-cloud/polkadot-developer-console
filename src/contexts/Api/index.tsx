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
import type { ApiStatus } from 'model/Api/types';
import { NetworkDirectory } from 'config/networks';

export const Api = createContext<ApiContextInterface>(defaultApiContext);

export const useApi = () => useContext(Api);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { getActiveTab, tabs } = useTabs();

  // Store API connection status of each tab. NOTE: requires ref as it is used in event listener.
  const [apiStatus, setApiStatusState] = useState<Record<number, ApiStatus>>(
    {}
  );
  const apiStatusRef = useRef(apiStatus);

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

  // Gets the `Api` instance of the active tab, if present.
  const getTabApi = () => {
    const activeTab = getActiveTab();
    if (activeTab?.chain) {
      return ApiController.instances[activeTab.id];
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
          setApiStatus({
            ...apiStatusRef.current,
            [tabId]: 'disconnected',
          });
          break;
        case 'error':
          setApiStatus({
            ...apiStatusRef.current,
            [tabId]: 'disconnected',
          });
          break;
        case 'destroyed':
          removeApiStatus(tabId);
          break;
      }
    }
  };

  // Listen for api status updates.
  const documentRef = useRef<Document>(document);
  useEventListener('api-status', handleNewApiStatus, documentRef);

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
      }}
    >
      {children}
    </Api.Provider>
  );
};
