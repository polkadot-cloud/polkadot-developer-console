// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { ApiController } from 'controllers/Api';
import type {
  ConstantResult,
  RawStorageSubscriptionConfig,
  SubscriptionConfig,
} from './types';
import type { AnyJson } from '@w3ux/utils/types';
import { splitChainStateKey } from './util';
import type { ApiInstanceId, OwnerId } from 'model/Api/types';
import { getIndexFromInstanceId } from 'model/Api/util';

export class ChainState {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated owner for this chain state instance.
  #ownerId: OwnerId;

  // The associated api instance for this chain state instance.
  #instanceId: ApiInstanceId;

  // Chain state subscription results, keyed by subscription key.
  subscriptions: Record<string, AnyJson> = {};

  // Chain state constant results, keyed by constant key.
  constants: Record<string, AnyJson> = {};

  // Unsubscribe objects, keyed by subscription key.
  #unsubs: Record<string, VoidFn> = {};

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(ownerId: OwnerId, instanceId: ApiInstanceId) {
    this.#ownerId = ownerId;
    this.#instanceId = instanceId;
  }

  // ------------------------------------------------------
  // Subscription.
  // ------------------------------------------------------

  // Subscribe to chain state query.
  subscribe = async (
    rawKey: string,
    config: SubscriptionConfig
  ): Promise<void> => {
    const api = ApiController.getInstance(
      this.#ownerId,
      getIndexFromInstanceId(this.#instanceId)
    );
    const subscriptionKey = this.prependIndexToKey('subscription', rawKey);

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
                this.subscriptions[subscriptionKey] = { type, result };

                // Send result to UI.
                document.dispatchEvent(
                  new CustomEvent('callback-new-chain-state', {
                    detail: {
                      ownerId: this.#ownerId,
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
  // Constants.
  // ------------------------------------------------------

  fetchConstant = (pallet: string, constant: string): ConstantResult | null => {
    const api = ApiController.getInstance(
      this.#ownerId,
      getIndexFromInstanceId(this.#instanceId)
    );
    const result = api?.consts?.[pallet]?.[constant];

    if (result) {
      const rawKey = `${pallet}_${constant}`;
      const key = this.prependIndexToKey('constant', rawKey);
      const value = {
        type: 'constant',
        result,
      };

      this.constants[key] = value;
      return { key, value };
    }
    return null;
  };

  // ------------------------------------------------------
  // Utilities.
  // ------------------------------------------------------

  // Prepend an index and underscore to the start of a subscription key.
  prependIndexToKey = (
    type: 'constant' | 'subscription',
    subscriptionKey: string
  ): string => {
    const entries =
      type === 'subscription' ? this.subscriptions : this.constants;

    // Iterate `this.subscriptions`, use `splitChainStateKey` to find the highest index, and
    // increment by 1.
    const greatestIndex = Object.keys(entries).reduce((acc: number, key) => {
      const [index] = splitChainStateKey(key);
      return Number(index) > acc ? Number(index) : acc;
    }, 0);
    return `${greatestIndex + 1}_${subscriptionKey}`;
  };

  // ------------------------------------------------------
  // Unsubscribe & removal.
  // ------------------------------------------------------

  // Unsubscribe from one class subscription.
  unsubscribeOne = (subscriptionKey: string): void => {
    const unsub = this.#unsubs[subscriptionKey];

    if (unsub !== undefined) {
      if (typeof unsub === 'function') {
        unsub();
      }

      delete this.subscriptions[subscriptionKey];
      delete this.#unsubs[subscriptionKey];
    }
  };

  // Unsubscribe from all class #subscriptions.
  unsubscribeAll = (): void => {
    for (const key in Object.keys(this.#unsubs)) {
      this.unsubscribeOne(key);
    }
  };

  // Remove a constant from class state.
  removeConstant = (key: string): void => {
    delete this.constants[key];
  };
}
