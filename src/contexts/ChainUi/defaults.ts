// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ChainUiContextInterface, ChainUiNamespace } from './types';

export const defaultChainUiState = {};

export const defaultChainUiInner = {
  selected: '',
  search: '',
  selectOnSearch: true,
  pallet: '',
  palletSearch: '',
  palletSelectOnSearch: true,
};

export const defaultChainUiNamespace: ChainUiNamespace = {
  storage: defaultChainUiInner,
  constants: defaultChainUiInner,
  calls: defaultChainUiInner,
  raw: defaultChainUiInner,
};

export const defaultChainContext: ChainUiContextInterface = {
  chainUi: defaultChainUiState,
  getPalletVersions: (ownerId) => undefined,
  getChainUi: (tabId, namespace) => defaultChainUiInner,
  setChainUiNamespace: (tabId, namespace, key, value) => {},
  isChainUiValueEmpty: (tabId, namespace, key) => true,
  destroyTabChainUi: (tabId) => {},
  fetchPalletVersions: async (ownerId, metadata, apiInstance) => {},
  getActiveChainStateSection: (tabId) => 'storage',
  setActiveChainStateSection: (tabId, section) => {},
  getInputArgs: (tabId, section) => null,
  getInputArgsAtKey: (tabId, section, key) => undefined,
  setInputArgAtKey: (tabId, section, key, value) => {},
  resetInputArgSection: (tabId, section) => {},
};
