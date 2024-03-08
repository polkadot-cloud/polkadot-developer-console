// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { ConnectFrom, Tabs, TabsContextInterface } from './types';
import { defaultTabs, defaultTabsContext } from './defaults';
import * as local from './Local';
import { useSettings } from 'contexts/Settings';
import { NetworkDirectory, type ChainId } from 'config/networks';
import { checkLocalTabs } from 'IntegrityChecks';
import { ApiController } from 'controllers/ApiController';

checkLocalTabs();

export const TabsContext =
  createContext<TabsContextInterface>(defaultTabsContext);

export const useTabs = () => useContext(TabsContext);

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  const { autoConnect, autoTabNaming } = useSettings();

  // Created tabs.
  const [tabs, setTabsState] = useState<Tabs>(local.getTabs() || defaultTabs);

  // Current active tab id.
  const [activeTabId, setActiveTabIdState] = useState<number>(
    local.getActiveTabId() || 1
  );

  // Current active tab index.
  const [activeTabIndex, setActiveTabIndexState] = useState<number>(
    local.getActiveTabIndex() || 1
  );

  // Current hovered tab index.
  const [tabHoverIndex, setTabHoverIndex] = useState<number>(-1);

  // Current drag tab index.
  const [dragId, setDragId] = useState<number | null>(null);

  // Whether the tab menu is hidden.
  const [tabsHidden, setTabsHidden] = useState<boolean>(false);

  // Instantiated tab ids.
  const instantiatedIds = useRef<number[]>([]);

  // Redirect counter to trigger redirect effects.
  const [redirectCounter, setRedirectCounter] = useState<number>(0);

  // Increment redirect counter.
  const incrementRedirectCounter = () => {
    setRedirectCounter(redirectCounter + 1);
  };

  // Adds an id to instantiated tabs.
  const addInstantiatedId = (index: number) => {
    instantiatedIds.current = [
      ...new Set(instantiatedIds.current.concat(index)),
    ];
  };

  // Sets tabs state, and updates local storage.
  const setTabs = (newTabs: Tabs) => {
    local.setTabs(newTabs);
    setTabsState(newTabs);
  };

  // Sets active tab id, and updates local storage.
  const setActiveTabId = (id: number) => {
    local.setActiveTabId(id);
    setActiveTabIdState(id);
  };

  // Sets active tab index, and updates local storage.
  const setActiveTabIndex = (index: number) => {
    local.setActiveTabIndex(index);
    setActiveTabIndexState(index);
  };

  // Remove an id from destroying tabs.
  const removeInstantiatedId = (id: number) => {
    instantiatedIds.current = instantiatedIds.current.filter(
      (item) => item !== id
    );
  };

  // Gets a tab by its id.
  const getTab = (tabId: number) => tabs.find((tab) => tab.id === tabId);

  // Gets the active tab.
  const getActiveTab = () => getTab(activeTabId);

  // Gets a tab by chain id.
  const getChainTab = (chainId: ChainId) =>
    tabs.find((tab) => tab.chain?.id === chainId);

  // Gets the previously connected to chain, if present.
  const getStoredChain = (tabId: number) => {
    const tab = getTab(tabId);

    if (!tab?.chain?.id) {
      return undefined;
    }

    return { id: tab.chain.id, chain: NetworkDirectory[tab.chain.id] };
  };

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
        connectFrom: 'directory' as ConnectFrom,
        chain: undefined,
        name: 'New Tab',
        autoConnect,
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

    // Destroy any Api instance associated with tab.
    ApiController.destroy(id);
  };

  // Rename a tab.
  const renameTab = (id: number, name: string) => {
    const newTabs = tabs.map((tab) => (tab.id === id ? { ...tab, name } : tab));
    setTabs(newTabs);
  };

  // Forget a tab's chain.
  const forgetTabChain = (id: number) => {
    const newTabs = tabs.map((tab) =>
      tab.id === id ? { ...tab, chain: undefined } : tab
    );
    setTabs(newTabs);
  };

  // Gets the amount of tab names starting with the provided string.
  const getTabNameCount = (name: string) =>
    tabs.filter((tab) => tab.name.startsWith(name)).length;

  // Generate tab name for chain.
  const getAutoTabName = (chainId: ChainId) => {
    const chainName = NetworkDirectory[chainId].name;
    const existingNames = getTabNameCount(chainName);
    const tabName =
      existingNames === 0 ? chainName : `${chainName} ${existingNames + 1}`;

    return tabName;
  };

  // Connect tab to an Api instance and update its chain data.
  const connectTab = (tabId: number, chainId: ChainId, provider: string) => {
    const newTabs = [...tabs].map((tab) =>
      tab.id === tabId
        ? {
            ...tab,
            // Auto rename the tab here if the setting is turned on.
            name: autoTabNaming ? getAutoTabName(chainId) : tab.name,
            chain: { id: chainId, provider },
          }
        : tab
    );
    setTabs(newTabs);

    const endpoint = NetworkDirectory[chainId].providers[provider];
    ApiController.instantiate(tabId, chainId, endpoint);
  };

  // Instantiate an Api instance from tab chain data.
  const instantiateApiFromTab = async (tabId: number) => {
    const tab = getTab(tabId);
    if (tab?.chain) {
      const { id, provider } = tab.chain;
      const endpoint = NetworkDirectory[id]?.providers[provider];
      if (endpoint) {
        await ApiController.instantiate(tab.id, id, endpoint);
      }
    }
  };

  return (
    <TabsContext.Provider
      value={{
        tabs,
        setTabs,
        createTab,
        activeTabId,
        getTab,
        getChainTab,
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
        getAutoTabName,
        connectTab,
        instantiateApiFromTab,
        redirectCounter,
        incrementRedirectCounter,
        getStoredChain,
        forgetTabChain,
        instantiatedIds: instantiatedIds.current,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
