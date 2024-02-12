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
  // TODO: Connect to the Polkadot Relay chain (first tab).

  // Created tabs.
  const [tabs, setTabs] = useState<Tabs>(defaultTabs);

  // Currently active tab.
  const [activeTabId, setActiveTabId] = useState<number>(1);

  // Currently active tab index.
  const [activeTabIndex, setActiveTabIndex] = useState<number>(1);

  // Gets the currently hovered tab index.
  const [tabHoverIndex, setTabHoverIndex] = useState<number>(0);

  // Gets the active tab.
  const getActiveTab = () => tabs.find((tab) => tab.id === activeTabId);

  // Get the largest id from a list of tabs.
  const getLargestId = (list: Tabs) =>
    [...list].sort((a, b) => b.id - a.id)?.[0].id || 0;

  // Create a new tab.
  const createTab = () => {
    // Get the largest active tab id and increment it.
    const newTabId = getLargestId(tabs) + 1;

    const newTab = {
      id: newTabId,
      chain: undefined,
      name: 'New Tab',
    };

    const newTabs = [...tabs, newTab];

    setTabs(newTabs);
    setActiveTabId(newTabId);
    setActiveTabIndex(newTabs.length - 1);
  };

  // Removes a tab from state.
  const destroyTab = (index: number, id: number) => {
    // Remove destroyed tab from state.
    const newTabs = [...tabs].filter((t) => t.id !== id);
    setTabs(newTabs);

    // If the active tab is being closed, fall back to its previous tab.
    if (id === activeTabId) {
      setActiveTabId(Object.values(newTabs)[Math.max(index - 1, 0)]?.id);
      setActiveTabIndex(Math.max(index - 1, 0));
    }
    // Re-sync the active tab index if the destroyed tab was in front of it.
    if (activeTabIndex > index) {
      setActiveTabIndex(activeTabIndex - 1);
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
        tabHoverIndex,
        setTabHoverIndex,
        activeTabIndex,
        setActiveTabIndex,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
