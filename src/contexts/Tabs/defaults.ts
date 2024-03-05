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
};

export const DEFAULT_TAB_WIDTH_PX = 145;

export const TAB_TRANSITION_DURATION_MS = 300;

// TODO: derive this default value from `NetworkDirectory`.
export const defaultTabs: Tabs = [
  {
    id: 1,
    chainId: 'polkadot-relay-chain',
    name: 'Polkadot Relay',
    autoConnect: true,
  },
  {
    id: 2,
    chainId: 'kusama-relay-chain',
    name: 'Kusama Relay',
    autoConnect: true,
  },
  {
    id: 3,
    chainId: 'westend-relay-chain',
    name: 'Westend Relay Long Name',
    autoConnect: true,
  },
];

export const defaultEemptyTab: Tab = {
  id: -1,
  chainId: undefined,
  name: '',
  autoConnect: true,
};
