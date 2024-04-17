// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { VoidFn } from '@polkadot/api/types';
import { stringToBigNumber } from '@w3ux/utils';
import type { AnyJson } from '@w3ux/utils/types';
import type { ChainId } from 'config/networks';
import { ApiController } from 'controllers/Api';
import type { Balances } from './types';
import type { Unsubscribable } from 'controllers/Subscriptions/types';

export class AccountBalances implements Unsubscribable {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Accounts that are being subscribed to.
  #accounts: string[] = [];

  // The associated tab id for this block number instance.
  #tabId: number;

  // The supplied chain id.
  #chainId: ChainId;

  // Account balances, populated by api callbacks.
  balances: Record<string, Balances> = {};

  // Unsubscribe objects.
  #unsubs: Record<string, VoidFn> = {};

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(tabId: number, chainId: ChainId) {
    this.#tabId = tabId;
    this.#chainId = chainId;
  }

  // ------------------------------------------------------
  // Account syncing.
  // ------------------------------------------------------

  // Sync account balance.
  syncAccounts = async (newAccounts: string[]): Promise<void> => {
    // Handle accounts that have been removed.
    this.handleRemovedAccounts(newAccounts);

    // Determine new accounts that need to be subscribed to.
    const accountsAdded = newAccounts.filter(
      (account) => !this.#accounts.includes(account)
    );

    // Exit early if there are no new accounts to subscribe to.
    if (!accountsAdded.length) {
      return;
    }

    // Get api instance and subscribe to new accounts.
    const api = ApiController.instances[this.#tabId].api;
    if (api) {
      accountsAdded.forEach(async (address) => {
        this.#accounts.push(address);

        const unsub = await api.queryMulti<AnyJson>(
          [
            [api.query.system.account, address],
            [api.query.balances.locks, address],
          ],
          async ([
            { data: accountData, nonce },
            locksResult,
          ]): Promise<void> => {
            // Update balance data for this address.
            this.balances[address] = {
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
                  address,
                  balance: this.balances[address],
                },
              })
            );
          }
        );

        this.#unsubs[address] = unsub;
      });
    }
  };

  // Remove accounts that no longer exist.
  handleRemovedAccounts = (newAccounts: string[]): void => {
    // Determine removed accounts.
    const accountsRemoved = this.#accounts.filter(
      (account) => !newAccounts.includes(account)
    );

    // Unsubscribe from removed account subscriptions.
    accountsRemoved.forEach((account) => {
      if (this.#unsubs[account]) {
        this.#unsubs[account]();
      }
      delete this.#unsubs[account];
      delete this.balances[account];
    });

    // Remove removed accounts from class.
    this.#accounts = this.#accounts.filter(
      (account) => !accountsRemoved.includes(account)
    );
  };

  // ------------------------------------------------------
  // Unsubscribe handler.
  // ------------------------------------------------------

  // Unsubscribe from all class subscriptions.
  unsubscribe = (): void => {
    Object.values(this.#unsubs).forEach((unsub) => {
      unsub();
    });
  };
}
