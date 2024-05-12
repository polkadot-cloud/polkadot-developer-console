// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect } from 'react';
import { useTabs } from 'contexts/Tabs';
import { useChainBrowser } from 'contexts/ChainBrowser';
import type { AnyJson } from '@w3ux/utils/types';

export const Api = createContext<AnyJson>({});

export const useApi = () => useContext(Api);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { tabs } = useTabs();
  const { instantiateApiFromTab } = useChainBrowser();

  // Initialisation of Api.
  useEffect(() => {
    // Instantiate Api instances from tabs.
    tabs.forEach((tab) => {
      if (tab.taskData?.autoConnect) {
        instantiateApiFromTab(tab.id);
      }
    });
  }, []);

  return <Api.Provider value={{}}>{children}</Api.Provider>;
};
