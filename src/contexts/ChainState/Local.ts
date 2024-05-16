// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';
import type {
  ChainStateConstants,
  ChainStateSubscription,
  ChainStateSubscriptionLocal,
  ChainStateSubscriptions,
} from './types';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved chain state subscriptions from local storage, or returns undefined otherwise.
export const getChainStateSubscriptions = ():
  | ChainStateSubscriptionLocal
  | undefined => {
  const result = localStorageOrDefault('chainStateSubs', undefined, true) as
    | ChainStateSubscriptionLocal
    | undefined;

  if (result) {
    return result as ChainStateSubscriptionLocal;
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
  // Convert each entry to local format. Maintains configs but removes result and timestamp.
  const formatted = Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      formatLocalSubscriptionEntry(entry),
    ])
  );

  localStorage.setItem('chainStateSubs', JSON.stringify(formatted));
};

// Sets chain state constants to local storage.
export const setChainStateConstants = (value: ChainStateConstants) => {
  localStorage.setItem('chainStateConsts', JSON.stringify(value));
};

// ------------------------------------------------------
// Utils.
// ------------------------------------------------------

export const formatLocalSubscriptionEntry = (
  entry: ChainStateSubscription
): ChainStateSubscriptionLocal => {
  const { namespace, method, args, type, pinned } = entry;

  return {
    type,
    namespace,
    method,
    args,
    pinned,
  };
};
