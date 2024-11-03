// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { VoidFn } from '@polkadot/api/types';
import { rmCommas } from '@w3ux/utils';
import type { AnyJson } from '@w3ux/types';
import type { ChainId } from 'config/networks/types';
import { ApiController } from 'controllers/Api';
import type { Balances } from './types';
import type { Unsubscribable } from 'controllers/Subscriptions/types';
import type { ApiInstanceId } from 'model/Api/types';
import { getIndexFromInstanceId } from 'model/Api/util';
import type { OwnerId } from 'types';
import BigNumber from 'bignumber.js';

export class AccountBalances implements Unsubscribable {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // Accounts that are being subscribed to.
  #accounts: string[] = [];

  // The associated owner for this instance.
  #ownerId: OwnerId;

  // The associated api instance for this instance.
  #instanceId: ApiInstanceId;

  // The supplied chain id.
  #chainId: ChainId;

  // Account balances, populated by api callbacks.
  balances: Record<string, Balances> = {};

  // Unsubscribe objects.
  #unsubs: Record<string, VoidFn> = {};

  // ------------------------------------------------------
  // Constructor.
  // ------------------------------------------------------

  constructor(ownerId: OwnerId, instanceId: ApiInstanceId, chainId: ChainId) {
    this.#ownerId = ownerId;
    this.#instanceId = instanceId;
    this.#chainId = chainId;
  }

  // ------------------------------------------------------
  // Account syncing.
  // ------------------------------------------------------

  // Sync account balance.
  syncAccounts = async (newAccounts: string[]): Promise<void> => {
    try {
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
      const api = ApiController.getInstanceApi(
        this.#ownerId,
        getIndexFromInstanceId(this.#instanceId)
      );

      if (api) {
        accountsAdded.forEach(async (address) => {
          this.#accounts.push(address);

          const unsub = await api.queryMulti(
            [
              [api.query.system.account, address],
              [api.query.balances.locks, address],
            ],
            async ([
              { data: accountData, nonce },
              locksResult,
            ]: AnyJson): Promise<void> => {
              // Update balance data for this address.
              this.balances[address] = {
                nonce: nonce.toNumber(),
                balance: {
                  free: this.stringToBigNumber(accountData.free.toString()),
                  reserved: this.stringToBigNumber(
                    accountData.reserved.toString()
                  ),
                  frozen: this.stringToBigNumber(accountData.frozen.toString()),
                },
                locks: locksResult
                  .toHuman()
                  .map((lock: { id: string; amount: string }) => ({
                    ...lock,
                    id: lock.id.trim(),
                    amount: this.stringToBigNumber(lock.amount),
                  })),
              };

              // Send balance data to UI.
              document.dispatchEvent(
                new CustomEvent('callback-account-balance', {
                  detail: {
                    ownerId: this.#ownerId,
                    instanceId: this.#instanceId,
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
    } catch (e) {
      // Account balance subscription failed.
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

  // ------------------------------------------------------
  // Utils.
  // ------------------------------------------------------

  // Convert string to BigNumber.
  stringToBigNumber = (value: string): BigNumber =>
    new BigNumber(rmCommas(value));
}
