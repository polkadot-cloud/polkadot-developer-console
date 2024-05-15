// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId, NetworkDirectoryItem } from 'config/networks/types';
import type { ConnectFrom, TabChainData } from 'contexts/Tabs/types';
import type { IntegrityCheckedChainContext } from 'routes/Chain/Provider/types';

export interface ChainExplorerContextInterface {
  getStoredChain: (
    tabId: number
  ) => { id: ChainId; chain: NetworkDirectoryItem } | undefined;
  updateSs58: (id: number, ss58: number) => void;
  updateUnits: (id: number, units: number) => void;
  updateUnit: (id: number, unit: string) => void;
  connectChainExplorer: (
    tabId: number,
    chainId: ChainId,
    endpoint: string
  ) => void;
  forgetTabChain: (tabId: number) => void;
  chainExplorerIntegrityCheck: (
    tabId: number
  ) => IntegrityCheckedChainContext | false;
}

export interface ChainExplorerTaskData {
  chain: TabChainData | undefined;
  connectFrom: ConnectFrom;
  autoConnect: boolean;
}
