// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { Tab, Tabs, TabsContextInterface } from './types';

export const defaultTabsContext: TabsContextInterface = {
  tabs: [],
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
  setActiveTabIndex: (index) => {},
  addInstantiatedId: (id) => {},
  dragId: null,
  setDragId: (index) => {},
  tabsHidden: false,
  setTabsHidden: (hidden) => {},
  instantiatedIds: [],
  renameTab: (id, name) => {},
  redirectCounter: 0,
  incrementRedirectCounter: () => {},
  connectTab: (tabId, chainId, endpoint) => {},
  instantiateApiFromTab: (tabId) => {},
  getStoredChain: (tabId) => undefined,
  forgetTabChain: (tabId) => {},
  setTabAutoConnect: (id, autoConnect) => {},
  setTabForceDisconnect: (id, forceDisconnect) => {},
  switchTab: (tabId, tabIndex) => {},
  setTabConnectFrom: (tabId, connectFrom) => {},
};

export const DEFAULT_TAB_WIDTH_PX = 160;

export const TAB_TRANSITION_DURATION_MS = 300;

export const defaultTabs: Tabs = [
  {
    id: 1,
    connectFrom: 'directory',
    chain: {
      id: 'polkadot',
      endpoint: 'wss://rpc.ibp.network/polkadot',
    },
    name: 'Polkadot Relay Chain',
    forceDisconnect: false,
    autoConnect: true,
  },
  {
    id: 2,
    connectFrom: 'directory',
    chain: {
      id: 'kusama',
      endpoint: 'wss://rpc.ibp.network/kusama',
    },
    name: 'Kusama Relay Chain',
    forceDisconnect: false,
    autoConnect: true,
  },
  {
    id: 3,
    connectFrom: 'directory',
    chain: {
      id: 'rococo',
      endpoint: 'wss://rococo-rpc.polkadot.io',
    },
    name: 'Rococo Relay Chain',
    forceDisconnect: false,
    autoConnect: true,
  },
  {
    id: 4,
    connectFrom: 'directory',
    chain: undefined,
    name: 'Westend Relay Chain',
    forceDisconnect: false,
    autoConnect: false,
  },
];

export const defaultEemptyTab: Tab = {
  id: -1,
  connectFrom: 'directory',
  chain: undefined,
  name: '',
  forceDisconnect: false,
  autoConnect: false,
};
