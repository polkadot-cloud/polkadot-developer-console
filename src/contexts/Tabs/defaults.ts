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

export const DEFAULT_TAB_WIDTH_PX = 130;

export const TAB_TRANSITION_DURATION_MS = 300;

export const defaultTabs: Tabs = [
  {
    id: 1,
    chain: 'polkadot-relay',
    name: 'Polkadot Relay',
  },
  {
    id: 2,
    chain: 'kusama-relay',
    name: 'Kusama Relay',
  },
  {
    id: 3,
    chain: 'westend-relay',
    name: 'Westend Relay Long Name',
  },
];

export const defaultEemptyTab: Tab = {
  id: -1,
  chain: undefined,
  name: '',
};
