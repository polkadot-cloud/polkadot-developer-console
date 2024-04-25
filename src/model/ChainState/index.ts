// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { ApiController } from 'controllers/Api';
import type { RawStorageSubscriptionConfig, SubscriptionConfig } from './types';
import type { AnyJson } from '@w3ux/utils/types';

export class ChainState {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated tab id for this chain state instance.
  #tabId: number;

  // Chain state results, keyed by subscription key.
  results: Record<string, AnyJson>;

  // Unsubscribe objects, keyed by subscription key.
  #unsubs: Record<string, VoidFn> = {};

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(tabId: number) {
    this.#tabId = tabId;
  }

  // ------------------------------------------------------
  // Subscription.
  // ------------------------------------------------------

  // Subscribe to chain state query.
  subscribe = async (
    subscriptionKey: string,
    config: SubscriptionConfig
  ): Promise<void> => {
    const api = ApiController.instances[this.#tabId].api;

    if (api) {
      try {
        // Get the type of subscription. `raw` (storage keys) or `storage` (items).
        const { type } = config;

        // Subscribe to raw storage keys.
        if (type === 'raw') {
          const { namespace, method, args } =
            config as RawStorageSubscriptionConfig;

          // This call is optimistically attempting to subscribe to whatever config is being passed
          // into this method. A try catch covers the scenario where invalid config is passed, so
          // this is acceptable for now.
          //
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const unsub = (api as any).rpc[namespace][method](
            ...args,
            ([result]: AnyJson) => {
              const unwrapped = result.unwrapOr(null);
              console.log('Raw storage key test result:', unwrapped.toHex());
              // TODO: Send result to UI in `new-chain-state-result` event.
            }
          );
          this.#unsubs[subscriptionKey] = unsub;
        }
      } catch (e) {
        console.log('subscription error', e);
        // TODO: Send error to UI.
      }
    }
  };

  // Unsubscribe from one class subscription.
  unsubscribeOne = (key: string): void => {
    const unsub = this.#unsubs[key];

    if (unsub !== undefined) {
      if (typeof unsub === 'function') {
        unsub();
      }
      delete this.#unsubs[key];
    }
  };

  // Unsubscribe from all class subscriptions.
  unsubscribeAll = (): void => {
    for (const key in Object.keys(this.#unsubs)) {
      this.unsubscribeOne(key);
    }
  };
}
