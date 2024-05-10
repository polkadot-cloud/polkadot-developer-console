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
  setSelectedTabIndex: (index) => {},
  addInstantiatedId: (id) => {},
  dragId: null,
  setDragId: (index) => {},
  tabsHidden: false,
  setTabsHidden: (hidden) => {},
  instantiatedIds: [],
  renameTab: (id, name) => {},
  updateSs58: (id, ss58) => {},
  updateUnits: (id, units) => {},
  updateUnit: (id, unit) => {},
  redirectCounter: 0,
  incrementRedirectCounter: () => {},
  connectTab: (tabId, chainId, endpoint) => {},
  instantiateApiFromTab: (tabId) => {},
  getStoredChain: (tabId) => undefined,
  forgetTabChain: (tabId) => {},
  setTabAutoConnect: (id, autoConnect) => {},
  setTabForceDisconnect: (id, forceDisconnect) => {},
  setTabActivePage: (id, route, page, apiActive, persist) => {},
  switchTab: (tabId, tabIndex, connected) => {},
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
      ss58: 0,
      units: 10,
      unit: 'DOT',
      api: {
        instanceIndex: 0,
      },
    },
    name: 'Polkadot Relay Chain',
    forceDisconnect: false,
    autoConnect: true,
    activeTask: 'connectChain',
    activePage: 0,
  },
  {
    id: 2,
    connectFrom: 'directory',
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
    name: 'Kusama Relay Chain',
    forceDisconnect: false,
    autoConnect: true,
    activeTask: 'connectChain',
    activePage: 0,
  },
  {
    id: 3,
    connectFrom: 'directory',
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
    name: 'Rococo Relay Chain',
    forceDisconnect: false,
    autoConnect: true,
    activeTask: 'connectChain',
    activePage: 0,
  },
  {
    id: 4,
    connectFrom: 'directory',
    chain: undefined,
    name: 'New Tab',
    forceDisconnect: false,
    autoConnect: false,
    activeTask: null,
    activePage: 0,
  },
];

export const defaultEemptyTab: Tab = {
  id: -1,
  connectFrom: 'directory',
  chain: undefined,
  name: '',
  forceDisconnect: false,
  autoConnect: false,
  activeTask: null,
  activePage: 0,
};
export const defaultCustomEndpointChainMeta = {
  ss58: 0,
  units: 10,
  unit: 'UNIT',
};
