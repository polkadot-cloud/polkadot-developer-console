// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { ApiInstanceId } from 'model/Api/types';
import type { OwnerId } from 'types';

export type SubscriptionConfig =
  | RawStorageSubscriptionConfig
  | StorageSubscriptionInterface;

export type StorageType = StorageSubscriptionType | 'constant';

export type StorageSubscriptionType = 'raw' | 'storage';

// Configuration for raw subscriptions.
export interface RawStorageSubscriptionConfig {
  type: StorageSubscriptionType;
  namespace: string;
  method: string;
  args: AnyJson[];
}

// Configuration for storage item subscriptions.
export interface StorageSubscriptionInterface {
  type: StorageSubscriptionType;
  pallet: string;
  call: string;
  args: AnyJson[];
}

export interface ConstantResult {
  key: string;
  value: AnyJson;
}

export interface ChainStateEventDetail {
  ownerId: OwnerId;
  instanceId: ApiInstanceId;
  type: StorageSubscriptionType;
  key: string;
  value: AnyJson;
}
