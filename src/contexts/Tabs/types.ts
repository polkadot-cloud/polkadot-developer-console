// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { Dispatch, SetStateAction } from 'react';

export type Tabs = Tab[];

export interface Tab {
  id: number;
  chain:
    | {
        id: ChainId;
        provider: string;
      }
    | undefined;
  name: string;
  autoConnect: boolean;
}

export interface TabsContextInterface {
  tabs: Tabs;
  setTabs: (tabs: Tabs) => void;
  createTab: () => void;
  activeTabId: number;
  getChainTab: (chainId: ChainId) => Tab | undefined;
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
  getAutoTabName: (chainId: ChainId) => string;
  redirectCounter: number;
  incrementRedirectCounter: () => void;
  connectTab: (tabId: number, chainId: ChainId, endpoint: string) => void;
}
