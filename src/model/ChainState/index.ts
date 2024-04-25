// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { ApiController } from 'controllers/Api';
import type { RawStorageSubscriptionConfig, SubscriptionConfig } from './types';
import type { AnyJson } from '@w3ux/utils/types';
import { splitSubscriptionKey } from './util';

export class ChainState {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated tab id for this chain state instance.
  #tabId: number;

  // Chain state results, keyed by subscription key.
  results: Record<string, AnyJson> = {};

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
    rawKey: string,
    config: SubscriptionConfig
  ): Promise<void> => {
    const api = ApiController.instances[this.#tabId].api;
    const subscriptionKey = this.prependIndexToKey(rawKey);

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
          const unsub = await (api as any).rpc[namespace][method](
            ...args,
            ([data]: AnyJson) => {
              const result = data.unwrapOr(undefined);

              if (result !== undefined) {
                // Persist result to class chain state.
                this.results[subscriptionKey] = { type, result };

                // Send result to UI.
                document.dispatchEvent(
                  new CustomEvent(`callback-new-chain-state`, {
                    detail: {
                      tabId: this.#tabId,
                      type,
                      subscriptionKey,
                      result,
                    },
                  })
                );
              } else {
                // If the result is undefined, flagging an invalid subscription, unsubscribe and
                // delete from class.
                this.unsubscribeOne(subscriptionKey);
              }
            }
          );
          this.#unsubs[subscriptionKey] = unsub;
        }
      } catch (e) {
        // TODO: Send error to UI and handle as notification.
      }
    }
  };

  // ------------------------------------------------------
  // Utilities.
  // ------------------------------------------------------

  // Prepend an index and underscore to the start of a subscription key.
  prependIndexToKey = (subscriptionKey: string): string => {
    // Iterate this.results, use `splitSubscriptionKey` to find the highest index, and increment by
    // 1.
    const greatestIndex = Object.keys(this.results).reduce(
      (acc: number, key) => {
        const [index] = splitSubscriptionKey(key);
        return Number(index) > acc ? Number(index) : acc;
      },
      0
    );
    return `${greatestIndex + 1}_${subscriptionKey}`;
  };

  // ------------------------------------------------------
  // Unsubscribe.
  // ------------------------------------------------------

  // Unsubscribe from one class subscription.
  unsubscribeOne = (subscriptionKey: string): void => {
    const unsub = this.#unsubs[subscriptionKey];

    if (unsub !== undefined) {
      if (typeof unsub === 'function') {
        unsub();
      }

      delete this.results[subscriptionKey];
      delete this.#unsubs[subscriptionKey];
    }
  };

  // Unsubscribe from all class subscriptions.
  unsubscribeAll = (): void => {
    for (const key in Object.keys(this.#unsubs)) {
      this.unsubscribeOne(key);
    }
  };
}
