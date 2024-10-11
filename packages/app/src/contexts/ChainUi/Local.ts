// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { localStorageOrDefault } from '@w3ux/utils';
import type {
  ChainStateSections,
  ChainUiState,
  ChainStateFilters,
} from './types';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved chain ui from local storage, or returns undefined otherwise.
export const getChainUi = (): ChainUiState | undefined => {
  const result = localStorageOrDefault('chainUi', undefined, true) as
    | ChainUiState
    | undefined;

  if (result) {
    return result as ChainUiState;
  }
};

// Gets saved chain state sections from local storage, or returns undefined otherwise.
export const getChainStateSections = (): ChainStateSections | undefined => {
  const result = localStorageOrDefault(
    'chainStateSections',
    undefined,
    true
  ) as ChainStateSections | undefined;

  if (result) {
    return result as ChainStateSections;
  }
};

// Gets saved chain ui from local storage, or returns undefined otherwise.
export const getChainStateFilters = (): ChainStateFilters | undefined => {
  const result = localStorageOrDefault('chainStateFilters', undefined, true) as
    | ChainStateFilters
    | undefined;

  if (result) {
    return result as ChainStateFilters;
  }
};

// ------------------------------------------------------
// Setters.
// ------------------------------------------------------

// Sets chain ui to local storage.
export const setChainUi = (value: ChainUiState) => {
  localStorage.setItem('chainUi', JSON.stringify(value));
};

// Sets chain state sections to local storage.
export const setChainStateSections = (value: ChainStateSections) => {
  localStorage.setItem('chainStateSections', JSON.stringify(value));
};

// Sets chain state filters to local storage.
export const setChainStateFilters = (value: ChainStateFilters) => {
  localStorage.setItem('chainStateFilters', JSON.stringify(value));
};

// ------------------------------------------------------
// Remove.
// ------------------------------------------------------

// Removes chain ui from local storage for a tab.
export const removeLocalChainUi = (tabId: number) => {
  const chainUi = getChainUi() || {};
  delete chainUi[tabId];
  setChainUi(chainUi);

  const chainStateSections = getChainStateSections() || {};
  delete chainStateSections[tabId];
  setChainStateSections(chainStateSections);

  const chainStateFilters = getChainStateFilters() || {};
  delete chainStateFilters[tabId];
  setChainStateFilters(chainStateFilters);
};
