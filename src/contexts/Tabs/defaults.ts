// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { Tab, TabTask, Tabs, TabsContextInterface } from './types';

export const TASK_HOME_PAGE_INDEXES: Record<TabTask, [number, string]> = {
  chainExplorer: [0, 'Chain'],
  parachainSetup: [1, 'Parachain'],
};

export const defaultTabsContext: TabsContextInterface = {
  tabs: [],
  tabsRef: [],
  selectedTabId: 0,
  dragId: null,
  tabHoverIndex: 0,
  activeTabIndex: 0,
  instantiatedIds: [],
  redirectCounter: 0,
  setTabs: (tabs) => {},
  setSelectedTabId: (id) => {},
  createTab: () => {},
  destroyTab: (index, id) => {},
  getTab: (id) => undefined,
  setTabHoverIndex: (id) => {},
  setSelectedTabIndex: (index) => {},
  addInstantiatedId: (id) => {},
  setDragId: (index) => {},
  renameTab: (id, name) => {},
  getAutoTabName: (id, startsWith) => '',
  incrementRedirectCounter: () => {},
  setTabAutoConnect: (id, autoConnect) => {},
  setTabConnectFrom: (tabId, connectFrom) => {},
  setTabActivePage: (id, route, activePage, persist) => {},
  switchTab: (tabId, tabIndex) => {},
  getTabActiveTask: (tabId) => null,
  setTabActiveTask: (id, activeTask) => {},
  resetTabActiveTask: (tabId) => {},
  getTabTaskData: (tabId) => undefined,
  setTabTaskData: (tabId, value) => {},
};

export const defaultTabs: Tabs = [
  {
    id: 1,
    name: 'Polkadot Relay Chain',
    activeTask: 'chainExplorer',
    taskData: {
      connectFrom: 'directory',
      autoConnect: true,
      chain: {
        id: 'polkadot',
        endpoint: 'wss://rpc.ibp.network/polkadot',
        ss58: 0,
        units: 10,
        unit: 'DOT',
        api: {
          instanceIndex: 0,
        },
      },
    },
    ui: {
      activeConnectFrom: 'directory',
      autoConnect: true,
    },
    activePage: 0,
  },
  {
    id: 2,
    name: 'Kusama Relay Chain',
    activeTask: 'chainExplorer',
    taskData: {
      connectFrom: 'directory',
      autoConnect: true,
      chain: {
        id: 'kusama',
        endpoint: 'wss://rpc.ibp.network/kusama',
        ss58: 2,
        units: 12,
        unit: 'KSM',
        api: {
          instanceIndex: 0,
        },
      },
    },
    ui: {
      activeConnectFrom: 'directory',
      autoConnect: true,
    },
    activePage: 0,
  },
  {
    id: 3,
    name: 'Rococo Relay Chain',
    activeTask: 'chainExplorer',
    taskData: {
      connectFrom: 'directory',
      autoConnect: true,
      chain: {
        id: 'rococo',
        endpoint: 'wss://rococo-rpc.polkadot.io',
        ss58: 0,
        units: 12,
        unit: 'ROC',
        api: {
          instanceIndex: 0,
        },
      },
    },
    ui: {
      activeConnectFrom: 'directory',
      autoConnect: true,
    },
    activePage: 0,
  },
  {
    id: 4,
    name: 'New Tab',
    activeTask: null,
    taskData: undefined,
    ui: {
      activeConnectFrom: 'directory',
      autoConnect: false,
    },
    activePage: 0,
  },
];

export const defaultEemptyTab: Tab = {
  id: -1,
  name: '',
  activeTask: null,
  taskData: undefined,
  ui: {
    activeConnectFrom: 'directory',
    autoConnect: false,
  },
  activePage: 0,
};

export const DEFAULT_TAB_WIDTH_PX = 160;

export const TAB_TRANSITION_DURATION_MS = 300;
