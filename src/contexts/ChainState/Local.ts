// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';
import type { ChainStateConstants, ChainStateSubscriptions } from './types';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved chain state subscriptions from local storage, or returns undefined otherwise.
export const getChainStateSubscriptions = ():
  | ChainStateSubscriptions
  | undefined => {
  const result = localStorageOrDefault('chainStateSubs', undefined, true) as
    | ChainStateSubscriptions
    | undefined;

  if (result) {
    return result as ChainStateSubscriptions;
  }
};

// Gets saved chain state constants from local storage, or returns undefined otherwise.
export const getChainStateConstants = (): ChainStateConstants | undefined => {
  const result = localStorageOrDefault('chainStateConsts', undefined, true) as
    | ChainStateConstants
    | undefined;

  if (result) {
    return result as ChainStateConstants;
  }
};

// ------------------------------------------------------
// Setters.
// ------------------------------------------------------

// Sets chain state subscriptions to local storage.
export const setChainStateSubscriptions = (value: ChainStateSubscriptions) => {
  localStorage.setItem('chainStateSubs', JSON.stringify(value));
};

// Sets chain state constants to local storage.
export const setChainStateConstants = (value: ChainStateConstants) => {
  localStorage.setItem('chainStateConsts', JSON.stringify(value));
};
