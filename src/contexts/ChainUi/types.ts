// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import type { AnyJson } from '@w3ux/utils/types';
import type { MetadataVersion } from 'model/Metadata/types';

export interface ChainUiContextInterface {
  chainUi: ChainUiState;
  getChainUi: (tabId: number, section: keyof ChainUiItem) => ChainUiItemInner;
  setChainUiItem: (
    tabId: number,
    section: keyof ChainUiItem,
    key: string,
    value: string | boolean
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
  isChainUiValueEmpty: (
    tabId: number,
    section: keyof ChainUiItem,
    key: keyof ChainUiItemInner
  ) => boolean;
  getInputArgs: (tabId: number, section: InputNamespace) => InputArgs | null;
  getInputArgsAtKey: (
    tabId: number,
    section: InputNamespace,
    key: string
  ) => InputArg | null;
  setInputArgAtKey: (
    tabId: number,
    section: InputNamespace,
    key: string,
    arg: InputArg
  ) => void;
  resetInputArgSection: (tabId: number, section: InputNamespace) => void;
}

// Types associated with chain ui.
// -------------------------------

// Chain state object used for React state.
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
  // Whether automatic selection on search is enabled.
  selectOnSearch: boolean;
  // The selected pallet (not used for `raw` config).
  pallet: string;
  // The pallet search term (not used for `raw` config).
  palletSearch: string;
  // Whether automatic selection on search is enabled for pallet.
  palletSelectOnSearch: boolean;
}

// Store versions of pallets. {tabid: { palletName: version }}.
export type PalletVersions = Record<string, Record<string, string>>;

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

// One input arg.
export interface InputArg {
  // The type of input, e.g. Variant, Composite, etc.
  input: string;
  // The input data.
  value?: AnyJson;
}

// The section input args are being applied to.
export type InputNamespace = 'storage' | 'call';
