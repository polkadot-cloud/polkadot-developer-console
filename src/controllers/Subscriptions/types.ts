// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AccountBalances } from 'model/AccountBalances';
import type { BlockNumber } from 'model/BlockNumber';
import type { NextFreeParaId } from 'model/NextFreeParaId';

// Define all possible subscription classes.
export type Subscription = AccountBalances | BlockNumber | NextFreeParaId;

// the record of subscriptions, keyed by tabId.
export type ChainSubscriptions = Record<string, Subscription>;

// Abstract class that ensures all subscription classes have an unsubscribe method.
export abstract class Unsubscribable {
  // Unsubscribe from unsubs present in this class.
  abstract unsubscribe: () => void;
}
