// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainSubscriptions, Subscription } from './types';

// A class to manage subscriptions.

export class SubscriptionsController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Subscription objects, keyed by a tabId.
  static #subs: Partial<Record<string, ChainSubscriptions>> = {};

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  // Gets all subscriptions for a tab.
  static getAll(tabId: number): ChainSubscriptions | undefined {
    return this.#subs[String(tabId)];
  }

  // Get a subscription by tabId and subscriptionId.
  static get(tabId: number, subscriptionId: string): Subscription | undefined {
    return this.#subs[String(tabId)]?.[subscriptionId] || undefined;
  }

  // ------------------------------------------------------
  // Setter.
  // ------------------------------------------------------

  // Sets a new subscription for a `tabId`.
  static set(
    tabId: number,
    subscriptionId: string,
    subscription: Subscription
  ): void {
    // Ignore if there is already a subscription for this tabId and subscriptionId.
    if (this.#subs?.[String(tabId)]?.[subscriptionId]) {
      return;
    }

    // Create a new subscriptions record for the tab if one doesn't exist.
    if (!this.#subs[tabId]) {
      this.#subs[String(tabId)] = {};
    }

    // NOTE: We know for certain that `this.#subs[tabId]` is defined here.
    this.#subs[String(tabId)]![subscriptionId] = subscription;
  }

  // ------------------------------------------------------
  // Unsubscribe.
  // ------------------------------------------------------

  // Unsubscribe from a subscription.
  static async removeSub(tabId: number, subscriptionId: string): Promise<void> {
    if (this.#subs[String(tabId)]) {
      try {
        delete this.#subs[String(tabId)]![subscriptionId];
      } catch (e) {
        // Silently fail if the subscription doesn't exist.
      }
    }
  }
}
