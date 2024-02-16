// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { Tabs, TabsContextInterface } from './types';
import { defaultTabs, defaultTabsContext } from './defaults';

export const TabsContext =
  createContext<TabsContextInterface>(defaultTabsContext);

export const useTabs = () => useContext(TabsContext);

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Connect to the Polkadot Relay chain (first tab).

  // Created tabs.
  const [tabs, setTabs] = useState<Tabs>(defaultTabs);

  // Current active tab id.
  const [activeTabId, setActiveTabId] = useState<number>(1);

  // Current active tab index.
  const [activeTabIndex, setActiveTabIndex] = useState<number>(1);

  // Current hovered tab index.
  const [tabHoverIndex, setTabHoverIndex] = useState<number>(-1);

  // Current drag tab index.
  const [dragId, setDragId] = useState<number | null>(null);

  // Whether the tab menu is hidden.
  const [tabsHidden, setTabsHidden] = useState<boolean>(false);

  // Instantiated tab ids.
  const instantiatedIds = useRef<number[]>([]);

  // Adds an id to instantiated tabs.
  const addInstantiatedId = (index: number) => {
    instantiatedIds.current = [
      ...new Set(instantiatedIds.current.concat(index)),
    ];
  };

  // Remove an id from destroying tabs.
  const removeInstantiatedId = (id: number) => {
    instantiatedIds.current = instantiatedIds.current.filter(
      (item) => item !== id
    );
  };
  // Gets the active tab.
  const getActiveTab = () => tabs.find((tab) => tab.id === activeTabId);

  // Get the largest id from a list of tabs.
  const getLargestId = (list: Tabs) =>
    [...list].sort((a, b) => b.id - a.id)?.[0].id || 0;

  // Creates a new tab and makes it active.
  const createTab = () => {
    // NOTE: The new tab ID is determined by getting the largest existing id and incrementing it.
    // This ensures that the new tab ID is unique. Tab IDs do not represent order.
    const newTabId = getLargestId(tabs) + 1;

    const newTabs = [
      ...tabs,
      {
        id: newTabId,
        chain: undefined,
        name: 'New Tab',
      },
    ];

    setTabs(newTabs);
    setActiveTabId(newTabId);
    setActiveTabIndex(newTabs.length - 1);
  };

  // Removes a tab from state.
  const destroyTab = (index: number, id: number) => {
    // Remove instantiated id.
    removeInstantiatedId(id);

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

  // Rename a tab.
  const renameTab = (id: number, name: string) => {
    const newTabs = tabs.map((tab) => (tab.id === id ? { ...tab, name } : tab));
    setTabs(newTabs);
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
        addInstantiatedId,
        setDragId,
        dragId,
        tabsHidden,
        setTabsHidden,
        renameTab,
        instantiatedIds: instantiatedIds.current,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
