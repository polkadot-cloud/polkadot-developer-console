// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { Tabs, TabsContextInterface } from './types';

export const defaultTabsContext: TabsContextInterface = {
  tabs: [],
  setTabs: (tabs) => {},
  activeTabId: 0,
  createTab: () => {},
  destroyTab: (index, id) => {},
  setActiveTabId: (id) => {},
  getActiveTab: () => undefined,
  tabHoverIndex: 0,
  setTabHoverIndex: (id) => {},
  activeTabIndex: 0,
  setActiveTabIndex: (index) => {},
};

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
