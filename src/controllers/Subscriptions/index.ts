// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { ChainSubscriptions, Subscription } from './types';

// A class to manage subscriptions.

export class SubscriptionsController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Subscription objects, keyed by a chainId.
  static #subs: Partial<Record<ChainId, ChainSubscriptions>> = {};

  // ------------------------------------------------------
  // Getter.
  // ------------------------------------------------------

  // Get a subscription by chainId and subscriptionId.
  static get(
    chainId: ChainId,
    subscriptionId: string
  ): Subscription | undefined {
    const chainSubs = this.#subs[chainId];
    return chainSubs ? chainSubs[subscriptionId] : undefined;
  }

  // ------------------------------------------------------
  // Setter.
  // ------------------------------------------------------

  // Sets a new subscription for a `chainId`.
  static set(
    chainId: ChainId,
    subscriptionId: string,
    subscription: Subscription
  ): void {
    // Ignore if there is already a subscription for this chainId and subscriptionId.
    if (this.#subs?.[chainId]?.[subscriptionId]) {
      return;
    }

    if (!this.#subs[chainId]) {
      this.#subs[chainId] = {};
    }

    if (this.#subs[chainId]) {
      // NOTE: We know for certain that `this.#subs[chainId]` is defined here.
      this.#subs[chainId]!.subscriptionId = subscription;
    }
  }
}
