// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ChainUiContextInterface, ChainUiItem } from './types';

export const defaultChainUiState = {};

export const defaultChainUiInner = {
  selected: '',
  search: '',
  pallet: '',
  palletSearch: '',
};

export const defaultChainUiItem: ChainUiItem = {
  storage: defaultChainUiInner,
  constants: defaultChainUiInner,
  calls: defaultChainUiInner,
};

export const defaultChainContext: ChainUiContextInterface = {
  chainUi: defaultChainUiState,
  getChainUi: (tabId, section) => defaultChainUiInner,
  setChainUiItem: (tabId, section, key, value) => {},
  getPalletVersions: (tabId) => undefined,
  fetchPalletVersions: async (tabId, metadata, apiInstance) => {},
  getActiveChainStateSection: (tabId) => 'storage',
  setActiveChainStateSection: (tabId, section) => {},
};
