// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type {
  StorageSubscriptionType,
  StorageType,
  SubscriptionCallConfig,
} from 'model/ChainState/types';
import type { OwnerId } from 'types';

export interface ChainStateContextInterface {
  getChainStateByType: (
    type: StorageSubscriptionType | undefined
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
  destroyTabChainState: () => void;
}

// Chain state subscriptions for a tab, keyed by subscription key.
export type ChainStateSubscriptions = Record<string, ChainStateSubscription>;

// A chain state subscription provided through an event callback.
export type ChainStateSubscriptionEventDetail = SubscriptionCallConfig & {
  type: StorageSubscriptionType;
  timestamp: number;
  key: string;
  result: AnyJson;
  pinned?: boolean;
};

export type ChainStateSubscription = SubscriptionCallConfig & {
  type: StorageType;
  timestamp: number;
  result: AnyJson;
  pinned: boolean;
};

// Chain state constants for a tab, keyed by constant key.
export type ChainStateConstants = Record<string, ChainStateConstant>;

export interface ChainStateConstant {
  type: StorageType;
  timestamp: number;
  result: AnyJson;
  pinned: boolean;
}

// The local storage entry for a chain state subscription records, keyed by ownerId.
export type ChainStateSubscriptionsLocal = Record<
  OwnerId,
  ChainStateSubscriptionLocalEntries
>;

// Local storage entries for chain state subscriptions, keyed by subscription key.
export type ChainStateSubscriptionLocalEntries = Record<
  string,
  ChainStateSubscriptionLocalEntry
>;

// A chain state subscription entry for local storage.
export type ChainStateSubscriptionLocalEntry = SubscriptionCallConfig & {
  type: StorageType;
  pinned: boolean;
};

// The local storage entry for chain state constants, keyed by ownerId.
export type ChainStateConstantsLocal = Record<
  OwnerId,
  ChainStateConstantsLocalEntries
>;

// Local storage entries for chain state subscriptions, keyed by subscription key.
export type ChainStateConstantsLocalEntries = Record<
  string,
  ChainStateConstantLocalEntry
>;

// A chain state constant entry for local storage.
export interface ChainStateConstantLocalEntry {
  pinned: boolean;
}
