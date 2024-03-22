// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import type { MetadataVersion } from 'model/Metadata/types';

export interface ChainUiContextInterface {
  chainUi: ChainUiState;
  setChainUiItem: (key: keyof ChainUiState, value: ChainUiItem) => void;
  getPalletVersions: (tabId: number) => Record<string, string> | undefined;
  fetchPalletVersions: (
    tabId: number,
    metadata: MetadataVersion,
    apiInstance: ApiPromise
  ) => void;
}

export interface ChainUiState {
  storage: ChainUiItem;
  constants: ChainUiItem;
  calls: ChainUiItem;
}

export interface ChainUiItem {
  selected: string;
  search: string;
  pallet: string;
  palletSearch: string;
}

export type PalletVersions = Record<string, Record<string, string>>;
