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
  setItemPinned: (
    type: StorageType,
    subscriptionKey: string,
    pinned: boolean
  ) => void;
  getTotalPinnedItems: () => number;
}

// Chain state subscriptions for a tab, keyed by subscription key.
export type ChainStateSubscriptions = Record<string, ChainStateSubscription>;

// A chain state subscription provided through an event callback.
export interface ChainStateSubscriptionEventDetail {
  type: StorageSubscriptionType;
  timestamp: number;
  key: string;
  value: AnyJson;
}

export interface ChainStateSubscription {
  type: StorageType;
  timestamp: number;
  result: AnyJson;
  pinned: boolean;
}

// Chain state constants for a tab, keyed by constant key.
export type ChainStateConstants = Record<string, ChainStateConstant>;

export interface ChainStateConstant {
  type: StorageType;
  timestamp: number;
  result: AnyJson;
  pinned: boolean;
}
