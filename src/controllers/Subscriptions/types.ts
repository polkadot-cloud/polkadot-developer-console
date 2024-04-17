// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AccountBalance } from 'model/AccountBalance';
import type { BlockNumber } from 'model/BlockNumber';

// Define all possible subscription classes.
export type Subscription = AccountBalance | BlockNumber;

// the record of subscriptions, keyed by tabId.
export type ChainSubscriptions = Record<string, Subscription>;

// Abstract class that ensures all subscription classes have an unsubscribe method.
export abstract class Unsubscribable {
  // Unsubscribe from unsubs present in this class.
  abstract unsubscribe: () => void;
}
