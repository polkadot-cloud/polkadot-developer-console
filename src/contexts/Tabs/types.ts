// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkDirectoryName } from 'config/networks';
import type { Dispatch, SetStateAction } from 'react';

export type Tabs = Tab[];

export interface Tab {
  id: number;
  chain: NetworkDirectoryName | undefined;
  name: string;
}

export interface TabsContextInterface {
  tabs: Tabs;
  setTabs: Dispatch<SetStateAction<Tabs>>;
  createTab: () => void;
  activeTabId: number;
  getActiveTab: () => Tab | undefined;
  destroyTab: (index: number, id: number) => void;
  setActiveTabId: Dispatch<SetStateAction<number>>;
  tabHoverIndex: number;
  setTabHoverIndex: Dispatch<SetStateAction<number>>;
  activeTabIndex: number;
  setActiveTabIndex: Dispatch<SetStateAction<number>>;
  addInstantiatedId: (id: number) => void;
  instantiatedIds: number[];
}
