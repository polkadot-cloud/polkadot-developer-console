// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ChainId, NetworkDirectoryItem } from 'config/networks/types';
import type { BaseTaskData } from 'contexts/Tabs/types';
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
  destroyStateChainExplorer: (tabId: number) => void;
}

export type ChainExplorerTaskData = BaseTaskData;
