// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AccountBalances } from 'model/AccountBalances';
import type { BlockNumber } from 'model/BlockNumber';
import type { NextFreeParaId } from 'model/NextFreeParaId';
import type { ChainSpec } from 'model/Observables/ChainSpec';
import type { TaggedMetadata } from 'model/Observables/TaggedMetadata';

// Define all possible subscription classes.
export type Subscription = UnsubSubscriptions | ObservableGetters;

// Polkadot JS API subscriptions (unsubscribe functions).
export type UnsubSubscriptions = AccountBalances | BlockNumber | NextFreeParaId;

// Polkadot API Getters (observables wrapped in an async function that resolve upon completion).
export type ObservableGetters = ChainSpec | TaggedMetadata;

// the record of subscriptions, keyed by tabId.
export type ChainSubscriptions = Record<string, Subscription>;

// Abstract class that ensures all subscription classes have an unsubscribe method.
export abstract class Unsubscribable {
  // Unsubscribe from unsubs present in this class.
  abstract unsubscribe: () => void;
}

// Abstract class that allows an await-able function to get a value from an observable.
export abstract class ObservableGetter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  declare get: () => Promise<any>;
  // Unsubscribe from unsubs present in this class.
  abstract unsubscribe: () => void;
}
