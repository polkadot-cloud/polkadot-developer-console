// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
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
  getTotalChainStateItems: () => number;
  setConstant: (key: string, value: AnyJson) => void;
}

// Chain state subscriptions for a tab, keyed by subscription key.
export type ChainStateSubscriptions = Record<string, ChainStateSubscription>;

export interface ChainStateSubscription {
  type: StorageType;
  timestamp: number;
  result: AnyJson;
}

// Chain state constants for a tab, keyed by constant key.
export type ChainStateConstants = Record<string, ChainStateConstant>;

export interface ChainStateConstant {
  type: StorageType;
  timestamp: number;
  result: AnyJson;
}
