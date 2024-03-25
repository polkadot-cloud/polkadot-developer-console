// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId, NetworkDirectoryItem } from 'config/networks';
import type { Dispatch, SetStateAction } from 'react';

export type Tabs = Tab[];

export interface Tab {
  id: number;
  connectFrom: ConnectFrom;
  chain:
    | {
        id: ChainId;
        endpoint: string;
      }
    | undefined;
  name: string;
  forceDisconnect: boolean;
  autoConnect: boolean;
}

export type ConnectFrom = 'directory' | 'customEndpoint';

export interface TabsContextInterface {
  tabs: Tabs;
  setTabs: (tabs: Tabs) => void;
  createTab: () => void;
  activeTabId: number;
  getTab: (id: number) => Tab | undefined;
  getActiveTab: () => Tab | undefined;
  destroyTab: (index: number, id: number) => void;
  setActiveTabId: (index: number) => void;
  tabHoverIndex: number;
  setTabHoverIndex: Dispatch<SetStateAction<number>>;
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  addInstantiatedId: (id: number) => void;
  setDragId: Dispatch<SetStateAction<number | null>>;
  dragId: number | null;
  tabsHidden: boolean;
  setTabsHidden: (hidden: boolean) => void;
  instantiatedIds: number[];
  renameTab: (id: number, name: string) => void;
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
  setTabConnectFrom: (tabId: number, connectFrom: ConnectFrom) => void;
}
