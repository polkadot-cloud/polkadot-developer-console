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

export const Api = createContext<ApiContextInterface>(defaultApiContext);

export const useApi = () => useContext(Api);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { getActiveTab, getChainTab } = useTabs();

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

  // Gets the Api instance of the active tab, if present.
  const getTabApi = () => {
    const chainId = getActiveTab()?.chainId;
    if (chainId) {
      return ApiController.instances[chainId];
    }
  };

  // Handle incoming api status updates.
  const handleNewApiStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { chainId, event } = e.detail;
      const tab = getChainTab(chainId);

      if (tab) {
        const tabId = tab.id;

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
        }
      }
    }
  };

  // Listen for api status updates.
  const documentRef = useRef<Document>(document);
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Initialisation of Api instances.
  useEffect(() => {
    // TOOD: implement.
  }, []);

  return (
    <Api.Provider
      value={{
        isReady: false,
        apiStatus,
        getTabApi,
      }}
    >
      {children}
    </Api.Provider>
  );
};
