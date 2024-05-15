// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiInstanceId } from 'model/Api/types';
import type { ChainSubscriptions, Subscription } from './types';

// A class to manage subscriptions.

export class SubscriptionsController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Subscription objects, keyed by an apiInstanceId.
  static #subs: Partial<Record<ApiInstanceId, ChainSubscriptions>> = {};

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  static get subs() {
    return this.#subs;
  }

  // Gets all subscriptions for an api instance.
  static getAll(instanceId: ApiInstanceId): ChainSubscriptions | undefined {
    return this.#subs[instanceId];
  }

  // Get a subscription by api instance and subscriptionId.
  static get(
    instanceId: ApiInstanceId,
    subscriptionId: string
  ): Subscription | undefined {
    return this.#subs[instanceId]?.[subscriptionId] || undefined;
  }

  // ------------------------------------------------------
  // Setter.
  // ------------------------------------------------------

  // Sets a new subscription for an api instance.
  static set(
    instanceId: ApiInstanceId,
    subscriptionId: string,
    subscription: Subscription
  ): void {
    // Ignore if there is already a subscription for this tabId and subscriptionId.
    if (this.#subs?.[instanceId]?.[subscriptionId]) {
      return;
    }

    // Create a new subscriptions record for the tab if one doesn't exist.
    if (!this.#subs[instanceId]) {
      this.#subs[instanceId] = {};
    }

    // NOTE: We know for certain that `this.#subs[instanceId]` is defined here.
    this.#subs[instanceId]![subscriptionId] = subscription;
  }

  // ------------------------------------------------------
  // Unsubscribe.
  // ------------------------------------------------------

  // Unsubscribe from a subscription and remove it from class state.
  static async remove(
    instanceId: ApiInstanceId,
    subscriptionId: string
  ): Promise<void> {
    if (this.#subs[instanceId]) {
      try {
        delete this.#subs[instanceId]![subscriptionId];
      } catch (e) {
        // Silently fail if the subscription doesn't exist.
      }
    }
  }
}
