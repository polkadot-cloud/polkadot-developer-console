// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { ActiveTabs, TabsContextInterface } from './types';
import { defaultTabsContext } from './defaults';

export const TabsContext =
  createContext<TabsContextInterface>(defaultTabsContext);

export const useTabs = () => useContext(TabsContext);

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Bootstrap the initial active tabs. Takes the relay chains from the network directory and opens tabs for them.
  // TODO: Connect to the Polkadot Relay chain (first tab).

  // Currently active tabs.
  const [activeTabs, setActiveTabs] = useState<ActiveTabs>({});

  return (
    <TabsContext.Provider
      value={{
        activeTabs,
        setActiveTabs,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
