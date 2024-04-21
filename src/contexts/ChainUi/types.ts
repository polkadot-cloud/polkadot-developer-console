// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import type { MetadataVersion } from 'model/Metadata/types';

export interface ChainUiContextInterface {
  chainUi: ChainUiState;
  getChainUi: (tabId: number, section: keyof ChainUiItem) => ChainUiItemInner;
  setChainUiItem: (
    tabId: number,
    section: keyof ChainUiItem,
    key: string,
    value: string
  ) => void;
  getPalletVersions: (tabId: number) => Record<string, string> | undefined;
  fetchPalletVersions: (
    tabId: number,
    metadata: MetadataVersion,
    apiInstance: ApiPromise
  ) => void;
  getActiveChainStateSection: (tabId: number) => string;
  setActiveChainStateSection: (
    tabId: number,
    section: ChainStateSection
  ) => void;
}

export type ChainUiState = Record<number, ChainUiItem>;

// Chain UI configs for each of the interfaces (storage, constants, calls, raw).
export interface ChainUiItem {
  storage: ChainUiItemInner;
  constants: ChainUiItemInner;
  calls: ChainUiItemInner;
  raw: ChainUiItemInner;
}

// A single chain UI config.
export interface ChainUiItemInner {
  // The selected item.
  selected: string;
  // The search term.
  search: string;
  // The selected pallet (not used for `raw` config).
  pallet: string;
  // The pallet search term (not used for `raw` config).
  palletSearch: string;
}

// Store versions of pallets. {tabid: { palletName: version }}.
export type PalletVersions = Record<string, Record<string, string>>;

// The active chain sections, keyed by tab.
export type ChainStateSections = Record<number, ChainStateSection>;

// The possible chain sections to be active.
export type ChainStateSection = 'storage' | 'constants' | 'calls' | 'raw';
