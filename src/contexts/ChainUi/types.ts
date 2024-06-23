// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { StorageType } from 'model/ChainState/types';

export interface ChainUiContextInterface {
  chainUi: ChainUiState;
  getChainUi: (
    tabId: number,
    namespace: keyof ChainUiNamespace
  ) => ChainUiNamespaceInner;
  setChainUiNamespace: (
    tabId: number,
    namespace: keyof ChainUiNamespace,
    key: string,
    value: string | boolean
  ) => void;
  isChainUiValueEmpty: (
    tabId: number,
    namespace: keyof ChainUiNamespace,
    key: keyof ChainUiNamespaceInner
  ) => boolean;
  destroyTabChainUi: (tabId: number) => void;
  getChainStateSection: (tabId: number) => string;
  setChainStateSection: (tabId: number, section: ChainStateSection) => void;
  getStorageItemFilter: (tabId: number, key: StorageType) => boolean;
  setStorageItemFilter: (
    tabId: number,
    key: StorageType,
    value: boolean
  ) => void;
  getInputArgs: (tabId: number, section: InputNamespace) => InputArgs | null;
  getInputArgAtKey: (
    tabId: number,
    section: InputNamespace,
    inputKey: string
  ) => InputArg | undefined;
  setInputArgAtKey: (
    tabId: number,
    section: InputNamespace,
    keys: InputArgTypeKeys,
    value: AnyJson
  ) => void;
  resetInputArgs: (tabId: number, section: InputNamespace) => void;
  resetInputArgsFromKey: (
    tabId: number,
    section: InputNamespace,
    fromKey: string,
    includeKey: boolean
  ) => void;
}

// Input arg type keys.
export interface InputArgTypeKeys {
  indexKey: string;
  inputKey: string;
}

// Types associated with chain ui.
// -------------------------------

// Chain state object used for React state.
export type ChainUiState = Record<number, ChainUiNamespace>;

// Chain UI configs for each of the interfaces (storage, constants, calls, raw).
export interface ChainUiNamespace {
  storage: ChainUiNamespaceInner;
  constants: ChainUiNamespaceInner;
  calls: ChainUiNamespaceInner;
  raw: ChainUiNamespaceInner;
}

// A single chain UI config.
export interface ChainUiNamespaceInner {
  // The selected item.
  selected: string;
  // The search term.
  search: string;
  // Whether automatic selection on search is enabled.
  selectOnSearch: boolean;
  // The selected pallet (not used for `raw` config).
  pallet: string;
  // The pallet search term (not used for `raw` config).
  palletSearch: string;
  // Whether automatic selection on search is enabled for pallet.
  palletSelectOnSearch: boolean;
}

// Storage item filters.
export type ChainStateFilters = Record<number, StorageItemFilter>;
export interface StorageItemFilter {
  storage?: boolean;
  constant?: boolean;
  raw?: boolean;
}

// The active chain sections, keyed by tab.
export type ChainStateSections = Record<number, ChainStateSection>;

// The possible chain sections to be active.
export type ChainStateSection = 'storage' | 'constants' | 'calls' | 'raw';

// Types associated with input arguments.
// --------------------------------------

// Input args object used for React state. Keyed by tab id.
export type InputArgsState = Record<
  number,
  {
    // There can be one persisted storage input for each tab.
    storage: InputArgs;
    // There can be one persisted call input for each tab.
    call: InputArgs;
  }
>;

// Input arguments for storage and call data.
export type InputArgs = Record<string, InputArg>;

// One input arg value.
export interface InputArg {
  indexKey: string;
  value: AnyJson;
}

// The section input args are being applied to.
export type InputNamespace = 'storage' | 'call';
