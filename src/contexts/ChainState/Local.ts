// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';
import type {
  ChainStateConstants,
  ChainStateSubscription,
  ChainStateSubscriptionsLocal,
  ChainStateSubscriptions,
  ChainStateSubscriptionLocalEntry,
  ChainStateConstantsLocal,
} from './types';
import type { OwnerId } from 'types';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved chain state subscriptions from local storage, or returns undefined otherwise.
export const getChainStateSubscriptions = ():
  | ChainStateSubscriptionsLocal
  | undefined => {
  const result = localStorageOrDefault('chainStateSubs', undefined, true) as
    | ChainStateSubscriptionsLocal
    | undefined;

  if (result) {
    return result as ChainStateSubscriptionsLocal;
  }
};

// Gets saved chain state constants from local storage, or returns undefined otherwise.
export const getChainStateConstants = ():
  | ChainStateConstantsLocal
  | undefined => {
  const result = localStorageOrDefault('chainStateConsts', undefined, true) as
    | ChainStateConstantsLocal
    | undefined;

  if (result) {
    return result as ChainStateConstantsLocal;
  }
};

// ------------------------------------------------------
// Setters.
// ------------------------------------------------------

// Sets chain state subscriptions to local storage.
export const setChainStateSubscriptions = (
  ownerId: OwnerId,
  value: ChainStateSubscriptions
) => {
  // Convert each entry to local format. Maintains configs but removes result and timestamp.
  const formatted = Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      formatLocalSubscriptionEntry(entry),
    ])
  );

  const current = getChainStateSubscriptions() || {};
  current[ownerId] = formatted;

  localStorage.setItem('chainStateSubs', JSON.stringify(current));
};

// Sets chain state constants to local storage.
export const setChainStateConstants = (
  ownerId: OwnerId,
  value: ChainStateConstants
) => {
  const current = getChainStateConstants() || {};
  current[ownerId] = value;
  localStorage.setItem('chainStateConsts', JSON.stringify(current));
};

// ------------------------------------------------------
// Utils.
// ------------------------------------------------------

export const formatLocalSubscriptionEntry = (
  entry: ChainStateSubscription
): ChainStateSubscriptionLocalEntry => {
  const { namespace, method, args, type, pinned } = entry;

  return {
    type,
    namespace,
    method,
    args,
    pinned,
  };
};
