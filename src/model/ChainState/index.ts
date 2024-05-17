// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { ApiController } from 'controllers/Api';
import type {
  ChainStateConstantEventDetail,
  ChainStateEventDetail,
  ConstantEntry,
  ConstantResult,
  RawStorageSubscriptionConfig,
  SubscriptionConfig,
  SubscriptionEntry,
  SubscriptionType,
} from './types';
import type { AnyJson } from '@w3ux/utils/types';
import { splitConstantKey, splitSubscriptionKey } from './util';
import type { ApiInstanceId } from 'model/Api/types';
import { getIndexFromInstanceId } from 'model/Api/util';
import type { OwnerId } from 'types';
import { getUnixTime } from 'date-fns';
import type { ChainStateSubscriptions } from 'contexts/ChainState/types';
import * as localChainState from 'contexts/ChainState/Local';

export class ChainState {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated owner for this chain state instance.
  #ownerId: OwnerId;

  // The associated api instance for this chain state instance.
  #instanceId: ApiInstanceId;

  // Chain state subscription results, keyed by subscription key.
  subscriptions: Record<string, SubscriptionEntry> = {};

  // Chain state constant results, keyed by constant key.
  constants: Record<string, ConstantEntry> = {};

  // Unsubscribe objects, keyed by subscription key.
  #unsubs: Record<string, VoidFn> = {};

  // Gets either subscription or constant entries from class state, injecting additional properties
  // for ui.
  getEntries(type: SubscriptionType): ChainStateSubscriptions {
    const entries = Object.entries(
      type === 'subscription' ? this.subscriptions : this.constants
    );

    const formatted = Object.fromEntries(
      entries.map((entry) => ({
        ...entry,
      }))
    ) as ChainStateSubscriptions;

    return formatted;
  }

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(ownerId: OwnerId, instanceId: ApiInstanceId) {
    this.#ownerId = ownerId;
    this.#instanceId = instanceId;

    // Get local subscriptions for this owner and subscribe to them.
    const localSubscriptions = localChainState.getChainStateSubscriptions();
    const entries = Object.entries(localSubscriptions?.[ownerId] || []);

    for (const [key, config] of entries) {
      if (config.type === 'raw') {
        this.subscribe(
          splitSubscriptionKey(key)[1],
          config as RawStorageSubscriptionConfig
        );
      }
    }

    // Get local constants for this owner.
    const localConstants = localChainState.getChainStateConstants();
    const constants = Object.entries(localConstants?.[ownerId] || []);

    for (const [key, config] of constants) {
      const [, pallet, constant] = splitConstantKey(key);
      const result = this.fetchConstant(pallet, constant, config.pinned);

      if (result) {
        this.dispatchConstant(result.key, result.value);
      }
    }
  }

  // ------------------------------------------------------
  // Subscription.
  // ------------------------------------------------------

  // Subscribe to chain state query.
  subscribe = async (
    rawKey: string,
    config: SubscriptionConfig
  ): Promise<void> => {
    const api = ApiController.getInstanceApi(
      this.#ownerId,
      getIndexFromInstanceId(this.#instanceId)
    );
    const subscriptionKey = this.prependIndexToKey('subscription', rawKey);

    if (api) {
      try {
        // Get the type of subscription. `raw` (storage keys) or `storage` (items).
        const { type, pinned } = config;
        const timestamp = getUnixTime(new Date());

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
              const callConfig = {
                type,
                namespace,
                method,
                args,
                timestamp,
                pinned: config?.pinned || false,
              };

              if (result !== undefined) {
                // Persist result to class chain state.
                this.subscriptions[subscriptionKey] = {
                  ...callConfig,
                  result,
                };

                const detail: ChainStateEventDetail = {
                  ...callConfig,
                  ownerId: this.#ownerId,
                  instanceId: this.#instanceId,
                  key: subscriptionKey,
                  pinned,
                  result,
                };

                // Send result to UI.
                document.dispatchEvent(
                  new CustomEvent('callback-new-chain-state-subscription', {
                    detail,
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

  // Fetches a constant from api metadata.
  fetchConstant = (
    pallet: string,
    constant: string,
    pinned = false
  ): ConstantResult | null => {
    const api = ApiController.getInstanceApi(
      this.#ownerId,
      getIndexFromInstanceId(this.#instanceId)
    );
    const result = api?.consts?.[pallet]?.[constant];

    if (result) {
      const rawKey = `${pallet}_${constant}`;
      const key = this.prependIndexToKey('constant', rawKey);

      const timestamp = getUnixTime(new Date());

      const value: ConstantEntry = {
        type: 'constant',
        timestamp,
        result,
        pinned,
      };

      this.constants[key] = value;
      return { key, value };
    }
    return null;
  };

  // Dispatch a constant to the UI.
  dispatchConstant = (key: string, value: ConstantEntry): void => {
    const timestamp = getUnixTime(new Date());

    const detail: ChainStateConstantEventDetail = {
      ownerId: this.#ownerId,
      instanceId: this.#instanceId,
      type: 'constant',
      key,
      timestamp,
      result: value.result,
      pinned: value.pinned,
    };

    document.dispatchEvent(
      new CustomEvent('callback-new-chain-state-constant', {
        detail,
      })
    );
  };

  // ------------------------------------------------------
  // Utilities.
  // ------------------------------------------------------

  // Prepend an index and underscore to the start of a subscription key.
  prependIndexToKey = (
    type: SubscriptionType,
    subscriptionKey: string
  ): string => {
    const entries =
      type === 'subscription' ? this.subscriptions : this.constants;

    // Iterate `this.subscriptions`, use `splitSubscriptionKey` to find the highest index, and
    // increment by 1.
    const greatestIndex = Object.keys(entries).reduce((acc: number, key) => {
      const [index] = splitSubscriptionKey(key);
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
