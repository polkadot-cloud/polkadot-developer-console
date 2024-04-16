// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainSubscriptions, Subscription } from './types';

// A class to manage subscriptions.

export class SubscriptionsController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Subscription objects, keyed by a chainId.
  #subs: Record<string, ChainSubscriptions> = {};

  // ------------------------------------------------------
  // Getter.
  // ------------------------------------------------------

  // Get a subscription by chainId and subscriptionId.
  get(chainId: string, subscriptionId: string): Subscription | undefined {
    const chainSubs = this.#subs[chainId];
    return chainSubs ? chainSubs[subscriptionId] : undefined;
  }

  // ------------------------------------------------------
  // Setter.
  // ------------------------------------------------------

  // Sets a new subscription for a `chainId`.
  set(
    chainId: string,
    subscriptionId: string,
    subscription: Subscription
  ): void {
    if (!this.#subs[chainId]) {
      this.#subs[chainId] = {};
    }

    this.#subs[chainId][subscriptionId] = subscription;
  }
}
