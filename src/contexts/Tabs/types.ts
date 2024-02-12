// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { NetworkDirectoryName } from 'config/networks';
import type { Dispatch, SetStateAction } from 'react';

export type Tabs = Tab[];

export interface Tab {
  id: number;
  chain: NetworkDirectoryName;
  name: string;
}

export interface TabsContextInterface {
  tabs: Tabs;
  setTabs: Dispatch<SetStateAction<Tabs>>;
  activeTabId: number;
  setActiveTabId: Dispatch<SetStateAction<number>>;
}
