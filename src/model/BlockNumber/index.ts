// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import type { ChainId } from 'config/networks';
import { ApiController } from 'controllers/Api';
import type { Unsubscribable } from 'controllers/Subscriptions/types';

export class BlockNumber implements Unsubscribable {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated tab id for this block number instance.
  #tabId: number;

  // The supplied chain id.
  #chainId: ChainId;

  // The current block number.
  blockNumber = '0';

  // Unsubscribe object.
  #unsub: VoidFn;

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(tabId: number, chainId: ChainId) {
    this.#tabId = tabId;
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
      const api = ApiController.instances[this.#tabId].api;

      if (api && this.#unsub === undefined) {
        // Get block numbers.
        const unsub = await api.query.system.number((num: number) => {
          // Update class block number.
          this.blockNumber = num.toString();

          // Send block number to UI.
          document.dispatchEvent(
            new CustomEvent(`callback-block-number`, {
              detail: {
                tabId: this.#tabId,
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
