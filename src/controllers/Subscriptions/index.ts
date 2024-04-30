// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { OwnerId } from 'model/Api/types';
import type { ChainSubscriptions, Subscription } from './types';

// A class to manage subscriptions.

export class SubscriptionsController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Subscription objects, keyed by a ownerId.
  static #subs: Partial<Record<OwnerId, ChainSubscriptions>> = {};

  // ------------------------------------------------------
  // Getters.
  // ------------------------------------------------------

  // Gets all subscriptions for an owner.
  static getAll(ownerId: OwnerId): ChainSubscriptions | undefined {
    return this.#subs[String(ownerId)];
  }

  // Get a subscription by ownerId and subscriptionId.
  static get(
    ownerId: OwnerId,
    subscriptionId: string
  ): Subscription | undefined {
    return this.#subs[String(ownerId)]?.[subscriptionId] || undefined;
  }

  // ------------------------------------------------------
  // Setter.
  // ------------------------------------------------------

  // Sets a new subscription for an owner.
  static set(
    ownerId: OwnerId,
    subscriptionId: string,
    subscription: Subscription
  ): void {
    // Ignore if there is already a subscription for this tabId and subscriptionId.
    if (this.#subs?.[String(ownerId)]?.[subscriptionId]) {
      return;
    }

    // Create a new subscriptions record for the tab if one doesn't exist.
    if (!this.#subs[ownerId]) {
      this.#subs[String(ownerId)] = {};
    }

    // NOTE: We know for certain that `this.#subs[tabId]` is defined here.
    this.#subs[String(ownerId)]![subscriptionId] = subscription;
  }

  // ------------------------------------------------------
  // Unsubscribe.
  // ------------------------------------------------------

  // Unsubscribe from a subscription and remove it from class state.
  static async remove(ownerId: OwnerId, subscriptionId: string): Promise<void> {
    if (this.#subs[String(ownerId)]) {
      try {
        delete this.#subs[String(ownerId)]![subscriptionId];
      } catch (e) {
        // Silently fail if the subscription doesn't exist.
      }
    }
  }
}
