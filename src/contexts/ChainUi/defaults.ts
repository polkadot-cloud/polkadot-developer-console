// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ChainUiContextInterface, ChainUiItem } from './types';

export const defaultChainUiState = {};

export const defaultChainUiItem: ChainUiItem = {
  storage: {
    selected: '',
    search: '',
    pallet: '',
    palletSearch: '',
  },
  constants: {
    selected: '',
    search: '',
    pallet: '',
    palletSearch: '',
  },
  calls: {
    selected: '',
    search: '',
    pallet: '',
    palletSearch: '',
  },
};

export const defaultChainContext: ChainUiContextInterface = {
  chainUi: defaultChainUiState,
  setChainUiItem: (key, value) => {},
  getPalletVersions: (tabId) => undefined,
  fetchPalletVersions: async (tabId, metadata, apiInstance) => {},
};
