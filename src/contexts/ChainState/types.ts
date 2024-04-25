// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type {
  StorageSubscriptionType,
  StorageType,
} from 'model/ChainState/types';

export interface ChainStateContextInterface {
  getChainStateByType: (
    type: StorageSubscriptionType
  ) => ChainStateSubscriptions;
  getChainStateItem: (subscriptionKey: string) => AnyJson | null;
  removeChainStateItem: (type: StorageType, subscriptionKey: string) => void;
  chainStateConstants: ChainStateConstants;
  setConstant: (key: string, value: AnyJson) => void;
}

// Chain state subscriptions for a tab, keyed by subscription key.
export type ChainStateSubscriptions = Record<string, ChainStateSubscription>;

export interface ChainStateSubscription {
  type: StorageSubscriptionType;
  result: AnyJson;
}

// Chain state constants for a tab, keyed by constant key.
export type ChainStateConstants = Record<string, AnyJson>;
