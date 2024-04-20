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

export interface ChainUiItem {
  storage: ChainUiItemInner;
  constants: ChainUiItemInner;
  calls: ChainUiItemInner;
  raw: ChainUiItemInner;
}

export interface ChainUiItemInner {
  selected: string;
  search: string;
  pallet: string;
  palletSearch: string;
}

export type PalletVersions = Record<string, Record<string, string>>;

export type ChainStateSections = Record<number, ChainStateSection>;

export type ChainStateSection = 'storage' | 'constants' | 'calls' | 'raw';
