// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Route } from 'App';
import type { ChainId, NetworkDirectoryItem } from 'config/networks';
import type { Dispatch, SetStateAction } from 'react';

// The tasks that developer console supports.
export type TabTask = 'connectChain' | 'newParachain';

export type Tabs = Tab[];

export interface Tab {
  id: number;
  name: string;
  activeTask: TabTask | null;
  taskData: taskData;
  activePage: number;
}

export type taskData = taskDataConnectChain | undefined;

export interface taskDataConnectChain {
  chain: TabChainData | undefined;
  connectFrom: ConnectFrom;
  forceDisconnect: boolean;
  autoConnect: boolean;
}

export interface TabChainData {
  id: ChainId;
  endpoint: string;
  ss58: number;
  units: number;
  unit: string;
  api: {
    instanceIndex: number;
  };
}

export interface ChainMeta {
  ss58: number;
  units: number;
  unit: string;
}

export type ConnectFrom = 'directory' | 'customEndpoint';

export interface TabsContextInterface {
  tabs: Tabs;
  setTabs: (tabs: Tabs) => void;
  createTab: () => void;
  selectedTabId: number;
  getTab: (id: number) => Tab | undefined;
  getActiveTab: () => Tab | undefined;
  destroyTab: (index: number, id: number) => void;
  setSelectedTabId: (index: number) => void;
  tabHoverIndex: number;
  setTabHoverIndex: Dispatch<SetStateAction<number>>;
  activeTabIndex: number;
  setSelectedTabIndex: (index: number) => void;
  addInstantiatedId: (id: number) => void;
  setDragId: Dispatch<SetStateAction<number | null>>;
  dragId: number | null;
  tabsHidden: boolean;
  setTabsHidden: (hidden: boolean) => void;
  instantiatedIds: number[];
  renameTab: (id: number, name: string) => void;
  updateSs58: (id: number, ss58: number) => void;
  updateUnits: (id: number, units: number) => void;
  updateUnit: (id: number, unit: string) => void;
  redirectCounter: number;
  incrementRedirectCounter: () => void;
  connectTab: (tabId: number, chainId: ChainId, endpoint: string) => void;
  instantiateApiFromTab: (tabId: number) => void;
  getStoredChain: (
    tabId: number
  ) => { id: ChainId; chain: NetworkDirectoryItem } | undefined;
  forgetTabChain: (tabId: number) => void;
  setTabAutoConnect: (id: number, autoConnect: boolean) => void;
  setTabForceDisconnect: (
    id: number,
    forceDisconnect: boolean,
    resetActiveTask: boolean
  ) => void;
  setTabActivePage: (
    id: number,
    route: Route,
    activePage: number,
    persist?: boolean
  ) => void;
  setTabConnectFrom: (tabId: number, connectFrom: ConnectFrom) => void;
  switchTab: (tabId: number, tabIndex: number) => void;
  getTabActiveTask: (tabId: number) => TabTask | null;
  setTabActiveTask: (tabId: number, task: TabTask | null) => void;
}

// Active pages structure used in local storage to keep track of active page indexes for each tab.

export type TabsActivePages = Record<string, TabActivePages> | undefined;

export interface TabActivePages {
  default?: number;
  settings?: number;
}
