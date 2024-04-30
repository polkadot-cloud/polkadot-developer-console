// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Route } from 'App';
import type { ChainId, NetworkDirectoryItem } from 'config/networks';
import type { Dispatch, SetStateAction } from 'react';

export type Tabs = Tab[];

export interface Tab {
  id: number;
  connectFrom: ConnectFrom;
  chain: TabChainData | undefined;
  name: string;
  forceDisconnect: boolean;
  autoConnect: boolean;
  activePage: number;
}

export interface TabChainData {
  id: ChainId;
  endpoint: string;
  ss58: number;
  units: number;
  unit: string;
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
  setTabForceDisconnect: (id: number, forceDisconnect: boolean) => void;
  setTabActivePage: (
    id: number,
    route: Route,
    page: number,
    apiActive: boolean,
    persist?: boolean
  ) => void;
  setTabConnectFrom: (tabId: number, connectFrom: ConnectFrom) => void;
  switchTab: (tabId: number, tabIndex: number) => void;
}
