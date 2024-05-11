// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type {
  ChainMeta,
  ConnectFrom,
  TabChainData,
  TabTask,
  Tabs,
  TabsContextInterface,
} from './types';
import {
  defaultCustomEndpointChainMeta,
  defaultTabs,
  defaultTabsContext,
} from './defaults';
import * as local from './Local';
import { useSettings } from 'contexts/Settings';
import { NetworkDirectory } from 'config/networks';
import type { ChainId, DirectoryId } from 'config/networks';
import { checkLocalTabs } from 'IntegrityChecks/Local';
import { ApiController } from 'controllers/Api';
import { isDirectoryId } from 'config/networks/Utils';
import { tabIdToOwnerId } from './Utils';
import type { Route } from 'App';

checkLocalTabs();

export const TabsContext =
  createContext<TabsContextInterface>(defaultTabsContext);

export const useTabs = () => useContext(TabsContext);

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  const { autoConnect, autoTabNaming } = useSettings();

  // Created tabs.
  const [tabs, setTabsState] = useState<Tabs>(local.getTabs() || defaultTabs);

  // Current active tab id.
  const [selectedTabId, setSelectedTabIdState] = useState<number>(
    local.getSelectedTabId() || 1
  );

  // Current active tab index.
  const [activeTabIndex, setSelectedTabIndexState] = useState<number>(
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

  // Sets selected tab id, and updates local storage.
  const setSelectedTabId = (id: number) => {
    local.setActiveTabId(id);
    setSelectedTabIdState(id);
  };

  // Sets active tab index, and updates local storage.
  const setSelectedTabIndex = (index: number) => {
    local.setSelectedTabIndex(index);
    setSelectedTabIndexState(index);
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
  const getActiveTab = () => getTab(selectedTabId);

  // Gets the previously connected to chain from network directory, if present.
  const getStoredChain = (tabId: number) => {
    const tab = getTab(tabId);

    if (!tab?.chain?.id || !isDirectoryId(tab.chain.id)) {
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
        forceDisconnect: !autoConnect,
        autoConnect,
        activeTask: null,
        activePage: 0,
      },
    ];

    setTabs(newTabs);
    setSelectedTabId(newTabId);
    setSelectedTabIndex(newTabs.length - 1);
  };

  // Removes a tab from state.
  const destroyTab = (index: number, id: number) => {
    // Remove instantiated id.
    removeInstantiatedId(id);

    // TODO: Remove `activePage` from local storage.

    // Remove destroyed tab from state.
    const newTabs = [...tabs].filter((t) => t.id !== id);
    setTabs(newTabs);

    // If the active tab is being closed, fall back to its previous tab.
    if (id === selectedTabId) {
      setSelectedTabId(Object.values(newTabs)[Math.max(index - 1, 0)]?.id);
      setSelectedTabIndex(Math.max(index - 1, 0));
    }
    // Re-sync the active tab index if the destroyed tab was in front of it.
    if (activeTabIndex > index) {
      setSelectedTabIndex(activeTabIndex - 1);
    }

    // Destroy any controller instances associated with tab.
    destroyControllers(id);
  };

  // Rename a tab.
  const renameTab = (id: number, name: string) => {
    const newTabs = tabs.map((tab) => (tab.id === id ? { ...tab, name } : tab));
    setTabs(newTabs);
  };

  // Update a tab's ss58 prefix.
  const updateSs58 = (id: number, ss58: number) => {
    const newTabs = tabs.map((tab) =>
      tab.id === id
        ? { ...tab, chain: tab?.chain ? { ...tab.chain, ss58 } : undefined }
        : tab
    );
    setTabs(newTabs);
  };

  // Update a tab's units.
  const updateUnits = (id: number, units: number) => {
    const newTabs = tabs.map((tab) =>
      tab.id === id
        ? { ...tab, chain: tab?.chain ? { ...tab.chain, units } : undefined }
        : tab
    );
    setTabs(newTabs);
  };

  // Update a tab's unit.
  const updateUnit = (id: number, unit: string) => {
    const newTabs = tabs.map((tab) =>
      tab.id === id
        ? { ...tab, chain: tab?.chain ? { ...tab.chain, unit } : undefined }
        : tab
    );
    setTabs(newTabs);
  };

  // Set a tab's autoConnect setting.
  const setTabAutoConnect = (id: number, checked: boolean) => {
    setTabs(
      tabs.map((tab) => {
        if (tab.id === id) {
          return {
            ...tab,
            autoConnect: checked,
          };
        }
        return tab;
      })
    );
  };

  // Set a tab's forceDisconnect setting.
  const setTabForceDisconnect = (
    id: number,
    checked: boolean,
    resetActiveTask: boolean
  ) => {
    setTabs(
      tabs.map((tab) => {
        if (tab.id === id) {
          return {
            ...tab,
            activeTask: resetActiveTask ? null : tab.activeTask,
            forceDisconnect: checked,
          };
        }
        return tab;
      })
    );
  };

  // Set a tab's active page.
  const setTabActivePage = (
    tabId: number,
    route: Route,
    activePage: number,
    persist = true
  ) => {
    if (persist) {
      local.setActivePage(tabId, route, activePage);
    }

    setTabs(
      tabs.map((tab) => {
        if (tab.id === tabId) {
          return {
            ...tab,
            activePage,
          };
        }
        return tab;
      })
    );
  };

  // Forget a tab's chain.
  const forgetTabChain = (tabId: number) => {
    // Disconnect from Api instance if present.
    if (getTab(tabId)?.chain) {
      destroyControllers(tabId);
    }
    // Update tab state.
    const newTabs = tabs.map((tab) =>
      tab.id === tabId ? { ...tab, chain: undefined } : tab
    );
    setTabs(newTabs);
  };

  // Set a tab's `connectFrom` property.
  const setTabConnectFrom = (id: number, connectFrom: ConnectFrom) => {
    const newTabs = tabs.map((tab) =>
      tab.id === id ? { ...tab, connectFrom } : tab
    );
    setTabs(newTabs);
  };

  // Gets the amount of tab names starting with the provided string.
  const getTabNameCount = (name: string) =>
    tabs.filter((tab) => tab.name.startsWith(name)).length;

  // Generate tab name for chain.
  const getAutoTabName = (chainId: DirectoryId) => {
    const chainName = NetworkDirectory[chainId].name;
    const existingNames = getTabNameCount(chainName);
    const tabName =
      existingNames === 0 ? chainName : `${chainName} ${existingNames + 1}`;

    return tabName;
  };

  // Switch tab.
  const switchTab = (tabId: number, tabIndex: number, connected: boolean) => {
    const localActivePage = local.getActivePage(tabId, 'default', connected);

    if (localActivePage !== undefined) {
      setTabActivePage(tabId, 'default', localActivePage, false);
    }

    setSelectedTabId(tabId);
    setSelectedTabIndex(tabIndex);
  };

  // Connect tab to an Api instance and update its chain data.
  const connectTab = (tabId: number, chainId: ChainId, endpoint: string) => {
    const isDirectory = isDirectoryId(chainId);

    // Inject chain meta from network directory or custom endpoint.
    let chainMeta: ChainMeta;
    if (isDirectory) {
      const system = NetworkDirectory[chainId].system;
      chainMeta = {
        ss58: system.ss58,
        units: system.units,
        unit: system.unit,
      };
    } else {
      const localChain = local.getTabs()?.find(({ id }) => id === tabId)?.chain;
      chainMeta = localChain || defaultCustomEndpointChainMeta;
    }

    const chainData = {
      ...chainMeta,
      id: chainId,
      endpoint,
      api: { instanceIndex: 0 },
    };

    const newTabs = [...tabs].map((tab) =>
      tab.id === tabId
        ? {
            ...tab,
            // Auto rename the tab here if the setting is turned on.
            name:
              autoTabNaming && isDirectory ? getAutoTabName(chainId) : tab.name,
            chain: chainData,
            // Chain is now assigned the `connectChain` task.
            activeTask: 'connectChain' as TabTask,
          }
        : tab
    );
    setTabs(newTabs);
    instantiateControllers(tabId, chainData);
  };

  // Instantiate an Api instance from tab chain data.
  const instantiateApiFromTab = async (tabId: number) => {
    const tab = getTab(tabId);
    if (tab?.chain) {
      if (tab?.autoConnect) {
        // This api instance is about to be reconnected to, so the active task here needs to be
        // persisted.
        setTabForceDisconnect(tabId, false, false);
      }
      instantiateControllers(tab.id, tab?.chain);
    }
  };

  // Instantiate controllers for a new tab.
  const instantiateControllers = async (tabId: number, chain: TabChainData) => {
    if (!chain) {
      return;
    }
    const ownerId = tabIdToOwnerId(tabId);
    const { id, endpoint } = chain;
    await ApiController.instantiate(ownerId, id, endpoint);
  };

  // Destroy controller instances for a tab.
  const destroyControllers = (tabId: number) => {
    const ownerId = tabIdToOwnerId(tabId);
    const tab = getTab(tabId);

    if (tab && tab.chain) {
      ApiController.destroyAll(ownerId);
    }
  };

  // Get an active task for a tab.
  const getTabActiveTask = (tabId: number) => getTab(tabId)?.activeTask || null;

  // Set an active task for a tab.
  const setTabActiveTask = (tabId: number, task: TabTask | null) => {
    const newTabs = tabs.map((tab) =>
      tab.id === tabId ? { ...tab, activeTask: task } : tab
    );
    setTabs(newTabs);
  };

  return (
    <TabsContext.Provider
      value={{
        tabs,
        setTabs,
        createTab,
        selectedTabId,
        getTab,
        getActiveTab,
        destroyTab,
        setSelectedTabId,
        tabHoverIndex,
        setTabHoverIndex,
        activeTabIndex,
        setSelectedTabIndex,
        addInstantiatedId,
        setDragId,
        dragId,
        tabsHidden,
        setTabsHidden,
        renameTab,
        updateSs58,
        updateUnits,
        updateUnit,
        connectTab,
        instantiateApiFromTab,
        redirectCounter,
        incrementRedirectCounter,
        getStoredChain,
        forgetTabChain,
        setTabConnectFrom,
        setTabAutoConnect,
        setTabForceDisconnect,
        setTabActivePage,
        switchTab,
        getTabActiveTask,
        setTabActiveTask,
        instantiatedIds: instantiatedIds.current,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
};
