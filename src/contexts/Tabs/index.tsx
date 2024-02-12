// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { Tabs, TabsContextInterface } from './types';
import { defaultTabs, defaultTabsContext } from './defaults';

export const TabsContext =
  createContext<TabsContextInterface>(defaultTabsContext);

export const useTabs = () => useContext(TabsContext);

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Bootstrap the initial active tabs. Takes the relay chains from the network directory and opens tabs for them.
  // TODO: Connect to the Polkadot Relay chain (first tab).

  // Created tabs.
  const [tabs, setTabs] = useState<Tabs>(defaultTabs);

  // Currently active tab.
  const [activeTabId, setActiveTabId] = useState<number>(1);

  // Gets the active tab.
  const getActiveTab = () => tabs.find((tab) => tab.id === activeTabId);

  // Create a new tab.
  const createTab = () => {
    const newTabId = tabs.length + 1;
    const newTab = {
      id: newTabId,
      chain: undefined,
      name: 'New Tab',
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(newTabId);
  };

  // Removes a tab from state.
  const destroyTab = (id: number) => {
    const newTabs = [...tabs].filter((t) => t.id !== id);

    setTabs(newTabs);
    if (id === activeTabId) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  return (
    <TabsContext.Provider
      value={{
        tabs,
        setTabs,
        createTab,
        activeTabId,
        getActiveTab,
        destroyTab,
        setActiveTabId,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
