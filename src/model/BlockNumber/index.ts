// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import type { ChainId } from 'config/networks';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { ApiInstanceId, OwnerId } from 'model/Api/types';
import { getIndexFromInstanceId } from 'model/Api/util';

export class BlockNumber implements Unsubscribable {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated owner for this instance.
  #ownerId: OwnerId;

  // The associated api instance for this instance.
  #instanceId: ApiInstanceId;

  // The supplied chain id.
  #chainId: ChainId;

  // The current block number.
  blockNumber = '0';

  // Unsubscribe object.
  #unsub: VoidFn;

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(ownerId: OwnerId, instanceId: ApiInstanceId, chainId: ChainId) {
    this.#ownerId = ownerId;
    this.#instanceId = instanceId;
    this.#chainId = chainId;

    // Subscribe immediately.
    this.subscribe();
  }

  // ------------------------------------------------------
  // Subscription.
  // ------------------------------------------------------

  // Subscribe to block number.
  subscribe = async (): Promise<void> => {
    try {
      const api = ApiController.getInstance(
        this.#ownerId,
        getIndexFromInstanceId(this.#instanceId)
      );

      if (api && this.#unsub === undefined) {
        // Get block numbers.
        const unsub = await api.query.system.number((num: number) => {
          // Update class block number.
          this.blockNumber = num.toString();

          // Send block number to UI.
          document.dispatchEvent(
            new CustomEvent('callback-block-number', {
              detail: {
                ownerId: this.#ownerId,
                instanceId: this.#instanceId,
                chainId: this.#chainId,
                blockNumber: num.toString(),
              },
            })
          );
        });

        // Subscription now initialised. Store unsub.
        this.#unsub = unsub as unknown as VoidFn;
      }
    } catch (e) {
      // Block number subscription failed.
    }
  };

  // ------------------------------------------------------
  // Unsubscribe handler.
  // ------------------------------------------------------

  // Unsubscribe from class subscription.
  unsubscribe = (): void => {
    if (typeof this.#unsub === 'function') {
      this.#unsub();
    }
  };
}
