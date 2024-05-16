// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { ApiInstanceId } from 'model/Api/types';
import type { OwnerId } from 'types';

export type SubscriptionConfig =
  | RawStorageSubscriptionConfig
  | StorageSubscriptionInterface;

export type StorageType = StorageSubscriptionType | 'constant';

export type StorageSubscriptionType = 'raw' | 'storage';

export interface SubscriptionCallConfig {
  namespace: string;
  method: string;
  args: AnyJson[];
}

// Configuration for raw subscriptions.
export type RawStorageSubscriptionConfig = SubscriptionCallConfig & {
  type: StorageSubscriptionType;
  pinned?: boolean;
};

// Configuration for storage item subscriptions.
export interface StorageSubscriptionInterface {
  type: StorageSubscriptionType;
  pallet: string;
  call: string;
  args: AnyJson[];
  pinned?: boolean;
}

export interface ConstantResult {
  key: string;
  value: ConstantEntry;
}

export type ChainStateEventDetail = SubscriptionCallConfig & {
  ownerId: OwnerId;
  instanceId: ApiInstanceId;
  type: StorageSubscriptionType;
  timestamp: number;
  key: string;
  result: AnyJson;
  pinned?: boolean;
};

export interface ChainStateEntry {
  type: StorageType;
  timestamp: number;
  result: AnyJson;
}
export type SubscriptionEntry = ChainStateEntry & SubscriptionCallConfig;

export type ConstantEntry = ChainStateEntry;

export type SubscriptionType = 'subscription' | 'constant';
