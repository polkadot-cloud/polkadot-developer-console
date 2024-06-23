// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
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
  getChainUi: (tabId, namespace) => defaultChainUiInner,
  setChainUiNamespace: (tabId, namespace, key, value) => {},
  isChainUiValueEmpty: (tabId, namespace, key) => true,
  destroyTabChainUi: (tabId) => {},
  getChainStateSection: (tabId) => 'storage',
  setChainStateSection: (tabId, section) => {},
  getStorageItemFilter: (tabId, key) => false,
  setStorageItemFilter: (tabId, key, value) => {},
  getInputArgs: (tabId, section) => null,
  getInputArgAtKey: (tabId, section, inputKey) => undefined,
  setInputArgAtKey: (tabId, section, keys, value) => {},
  resetInputArgs: (tabId, section) => {},
};
