// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';

export type SubscriptionConfig =
  | RawStorageSubscriptionConfig
  | StorageSubscriptionInterface;

export type StorageSubscriptionType = 'raw' | 'storage';

export interface RawStorageSubscriptionConfig {
  type: StorageSubscriptionType;
  namespace: string;
  method: string;
  args: AnyJson[];
}

export interface StorageSubscriptionInterface {
  type: StorageSubscriptionType;
  pallet: string;
  call: string;
  args: AnyJson[];
}

export interface ChainStateEventDetail {
  tabId: number;
  type: StorageSubscriptionType;
  key: string;
  value: AnyJson;
}
