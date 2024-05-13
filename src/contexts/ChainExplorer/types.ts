// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId, NetworkDirectoryItem } from 'config/networks';
import type { IntegrityCheckedChainContextProps } from 'routes/Chain/Provider/types';

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
  instantiateApiFromTab: (tabId: number) => void;
  forgetTabChain: (tabId: number) => void;
  chainExplorerTaskIntegrityChecks: (
    tabId: number
  ) => IntegrityCheckedChainContextProps | false;
}