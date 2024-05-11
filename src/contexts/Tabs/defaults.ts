// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { Tab, Tabs, TabsContextInterface } from './types';

// export const TAB_TASK_INDEXES: Record<TabTask | 'default', number> = {
//   default: 0,
//   chainBrowser: 1,
//   parachainSetup: 2,
// };

export const defaultTabsContext: TabsContextInterface = {
  tabs: [],
  tabsRef: [],
  setTabs: (tabs) => {},
  selectedTabId: 0,
  setSelectedTabId: (id) => {},
  createTab: () => {},
  destroyTab: (index, id) => {},
  getTab: (id) => undefined,
  getActiveTab: () => undefined,
  tabHoverIndex: 0,
  setTabHoverIndex: (id) => {},
  activeTabIndex: 0,
  setSelectedTabIndex: (index) => {},
  addInstantiatedId: (id) => {},
  dragId: null,
  setDragId: (index) => {},
  tabsHidden: false,
  setTabsHidden: (hidden) => {},
  instantiatedIds: [],
  renameTab: (id, name) => {},
  redirectCounter: 0,
  incrementRedirectCounter: () => {},
  setTabAutoConnect: (id, autoConnect) => {},
  setTabActivePage: (id, route, activePage, persist) => {},
  switchTab: (tabId, tabIndex) => {},
  getTabActiveTask: (tabId) => null,
  setTabActiveTask: (id, activeTask) => {},
};

export const defaultTabs: Tabs = [
  {
    id: 1,
    name: 'Polkadot Relay Chain',
    activeTask: 'chainBrowser',
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
    activeTask: 'chainBrowser',
    taskData: {
      connectFrom: 'directory',
      autoConnect: true,
      chain: {
        id: 'kusama',
        endpoint: 'wss://rpc.ibp.network/kusama',
        ss58: 2,
        units: 10,
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
    activeTask: 'chainBrowser',
    taskData: {
      connectFrom: 'directory',
      autoConnect: true,
      chain: {
        id: 'rococo',
        endpoint: 'wss://rococo-rpc.polkadot.io',
        ss58: 0,
        units: 10,
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
