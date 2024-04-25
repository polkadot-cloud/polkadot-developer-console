// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { StorageSubscriptionType } from 'model/ChainState/types';

export interface ChainStateContextInterface {
  getChainStateByType: (
    type: StorageSubscriptionType
  ) => ChainStateSubscriptions;
  getChainStateItem: (key: string) => AnyJson | null;
}

export type ChainStateSubscriptions = Record<string, ChainStateSubscription>;

export interface ChainStateSubscription {
  type: StorageSubscriptionType;
  result: AnyJson;
}
