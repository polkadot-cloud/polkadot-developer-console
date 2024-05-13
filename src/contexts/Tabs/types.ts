// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Route } from 'App';
import type { ChainId } from 'config/networks';
import type { Dispatch, SetStateAction } from 'react';

// The tasks that developer console supports.
export type TabTask = 'chainExplorer' | 'parachainSetup';

export interface TabsContextInterface {
  tabs: Tabs;
  tabsRef: Tabs;
  selectedTabId: number;
  dragId: number | null;
  tabHoverIndex: number;
  activeTabIndex: number;
  instantiatedIds: number[];
  redirectCounter: number;
  setTabs: (tabs: Tabs) => void;
  setSelectedTabId: (index: number) => void;
  createTab: () => void;
  getTab: (id: number) => Tab | undefined;
  destroyTab: (index: number, id: number) => void;
  setTabHoverIndex: Dispatch<SetStateAction<number>>;
  setSelectedTabIndex: (index: number) => void;
  addInstantiatedId: (id: number) => void;
  setDragId: Dispatch<SetStateAction<number | null>>;
  renameTab: (id: number, name: string) => void;
  getAutoTabName: (id: number, startsWith: string) => string;
  incrementRedirectCounter: () => void;
  setTabAutoConnect: (id: number, autoConnect: boolean) => void;
  setTabConnectFrom: (tabId: number, connectFrom: ConnectFrom) => void;
  setTabActivePage: (
    id: number,
    route: Route,
    activePage: number,
    persist?: boolean
  ) => void;
  switchTab: (tabId: number, tabIndex: number) => void;
  getTabActiveTask: (tabId: number) => TabTask | null;
  setTabActiveTask: (tabId: number, task: TabTask | null) => void;
  resetTabActiveTask: (tabId: number) => void;
  getTabTaskData: (tabId: number) => TaskData;
  setTabTaskData: (tabId: number, value: TaskData) => void;
}

export type Tabs = Tab[];

export interface Tab {
  id: number;
  name: string;
  activeTask: TabTask | null;
  taskData: TaskData;
  ui: {
    activeConnectFrom: ConnectFrom;
    autoConnect: boolean;
  };
  activePage: number;
}

export type TaskData = TaskDataChainBrowser | undefined;

export interface TaskDataChainBrowser {
  chain: TabChainData | undefined;
  connectFrom: ConnectFrom;
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

// Active pages structure used in local storage to keep track of active page indexes for each tab.
export type TabsActivePages = Record<string, TabActivePages> | undefined;

export interface TabActivePages {
  default?: number;
  settings?: number;
}
