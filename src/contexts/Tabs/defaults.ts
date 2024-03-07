// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { Tab, Tabs, TabsContextInterface } from './types';

export const defaultTabsContext: TabsContextInterface = {
  tabs: [],
  setTabs: (tabs) => {},
  activeTabId: 0,
  setActiveTabId: (id) => {},
  createTab: () => {},
  destroyTab: (index, id) => {},
  getChainTab: (chainId) => undefined,
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
  getAutoTabName: (chainId) => '',
  redirectCounter: 0,
  incrementRedirectCounter: () => {},
  connectTab: (tabId, chainId, endpoint) => {},
  instantiateApiFromTab: (tabId) => {},
  getStoredChain: (tabId) => undefined,
  forgetTabChain: (tabId) => {},
};

export const DEFAULT_TAB_WIDTH_PX = 160;

export const TAB_TRANSITION_DURATION_MS = 300;

// TODO: derive this default value from `NetworkDirectory`.
export const defaultTabs: Tabs = [
  {
    id: 1,
    chain: {
      id: 'polkadot',
      provider: 'IBP-GeoDNS1',
    },
    name: 'Polkadot Relay Chain',
    autoConnect: true,
  },
  {
    id: 2,
    chain: {
      id: 'kusama',
      provider: 'IBP-GeoDNS1',
    },
    name: 'Kusama Relay Chain',
    autoConnect: true,
  },
  {
    id: 3,
    chain: {
      id: 'rococo',
      provider: 'Parity',
    },
    name: 'Rococo Relay Chain',
    autoConnect: true,
  },
  {
    id: 4,
    chain: undefined,
    name: 'Westend Relay Chain',
    autoConnect: false,
  },
];

export const defaultEemptyTab: Tab = {
  id: -1,
  chain: undefined,
  name: '',
  autoConnect: false,
};
