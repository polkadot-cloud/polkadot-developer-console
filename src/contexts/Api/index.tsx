// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { defaultApiContext } from './defaults';
import type { ApiContextInterface } from './types';
import { ApiController } from 'controllers/ApiController';
import { useTabs } from 'contexts/Tabs';

export const Api = createContext<ApiContextInterface>(defaultApiContext);

export const useApi = () => useContext(Api);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { getActiveTab } = useTabs();

  // Gets the Api instance of the active tab, if present.
  const getTabApi = () => {
    const chainId = getActiveTab()?.chainId;
    if (chainId) {
      return ApiController.instances[chainId];
    }
  };

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
