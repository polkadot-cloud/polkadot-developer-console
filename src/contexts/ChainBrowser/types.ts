// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId, NetworkDirectoryItem } from 'config/networks';
import type { ConnectFrom } from 'contexts/Tabs/types';

export interface ChainBrowserContextInterface {
  getStoredChain: (
    tabId: number
  ) => { id: ChainId; chain: NetworkDirectoryItem } | undefined;
  updateSs58: (id: number, ss58: number) => void;
  updateUnits: (id: number, units: number) => void;
  updateUnit: (id: number, unit: string) => void;
  setTabConnectFrom: (tabId: number, connectFrom: ConnectFrom) => void;
  connectTab: (tabId: number, chainId: ChainId, endpoint: string) => void;
  instantiateApiFromTab: (tabId: number) => void;
  forgetTabChain: (tabId: number) => void;
  destroyControllers: (tabId: number) => void;
}
