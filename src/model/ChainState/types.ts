// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';

export type SubscriptionConfig =
  | RawStorageSubscriptionConfig
  | StorageSubscriptionInterface;

export interface RawStorageSubscriptionConfig {
  namespace: string;
  method: string;
  args: AnyJson[];
}

export interface StorageSubscriptionInterface {
  pallet: string;
  call: string;
  args: AnyJson[];
}
