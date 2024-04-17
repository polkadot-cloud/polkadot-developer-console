// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { stringToBigNumber } from '@w3ux/utils';
import type { AnyJson } from '@w3ux/utils/types';
import type { ChainId } from 'config/networks';
import { ApiController } from 'controllers/Api';
import type { Balances } from './types';

export class AccountBalance {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The associated tab id for this block number instance.
  #tabId: number;

  // The supplied chain id.
  #chainId: ChainId;

  // The supplied address.
  // TODO: Expand to support multiple addresses.
  #address: string;

  // The current account balance data.
  #balance: Balances;

  // Unsubscribe object.
  unsub: VoidFn;

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(tabId: number, chainId: ChainId, address: string) {
    this.#tabId = tabId;
    this.#chainId = chainId;
    this.#address = address;

    // Subscribe immediately.
    this.subscribe();
  }

  // ------------------------------------------------------
  // Subscription.
  // ------------------------------------------------------

  // Subscribe to block number.
  subscribe = async (): Promise<void> => {
    const api = ApiController.instances[this.#tabId].api;

    if (api && this.unsub === undefined) {
      const unsub = await api.queryMulti<AnyJson>(
        [
          [api.query.system.account, this.#address],
          [api.query.balances.locks, this.#address],
        ],
        async ([{ data: accountData, nonce }, locksResult]): Promise<void> => {
          // Update class data.
          this.#balance = {
            nonce: nonce.toNumber(),
            balance: {
              free: stringToBigNumber(accountData.free.toString()),
              reserved: stringToBigNumber(accountData.reserved.toString()),
              frozen: stringToBigNumber(accountData.frozen.toString()),
            },
            locks: locksResult
              .toHuman()
              .map((lock: { id: string; amount: string }) => ({
                ...lock,
                id: lock.id.trim(),
                amount: stringToBigNumber(lock.amount),
              })),
          };

          // Send balance data to UI.
          document.dispatchEvent(
            new CustomEvent('callback-account-balance', {
              detail: {
                tabId: this.#tabId,
                chainId: this.#chainId,
                address: this.#address,
                balance: this.#balance,
              },
            })
          );
        }
      );

      // Subscription now initialised. Store unsub.
      this.unsub = unsub as unknown as VoidFn;
    }
  };
}
