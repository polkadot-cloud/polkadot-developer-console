// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
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
  const { getActiveTab } = useTabs();

  // Store API connection status of each tab. NOTE: requires ref as it is used in event listener.
  const [apiStatus, setApiStatusState] = useState<Record<string, ApiStatus>>(
    {}
  );
  const apiStatusRef = useRef(apiStatus);

  // Setter for api status.
  const setApiStatus = (status: Record<string, ApiStatus>) => {
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

      switch (event) {
        case 'ready':
          setApiStatus({ ...apiStatusRef.current, [chainId]: 'ready' });
          break;
        case 'connecting':
          setApiStatus({ ...apiStatusRef.current, [chainId]: 'connecting' });
          break;
        case 'connected':
          setApiStatus({ ...apiStatusRef.current, [chainId]: 'connected' });
          break;
        case 'disconnected':
          setApiStatus({ ...apiStatusRef.current, [chainId]: 'disconnected' });
          break;
        case 'error':
          setApiStatus({ ...apiStatusRef.current, [chainId]: 'disconnected' });
          break;
      }
    }
  };

  const documentRef = useRef<Document>(document);

  useEventListener('api-status', handleNewApiStatus, documentRef);

  return (
    <Api.Provider
      value={{
        isReady: false,
        // TODO: apiStatus,
        // TODO: setRpcEndpoint,
        getTabApi,
      }}
    >
      {children}
    </Api.Provider>
  );
};
