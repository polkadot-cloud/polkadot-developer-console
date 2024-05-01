// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type {
  AccountBalancesState,
  AccountsContextInterface,
  BalanceLocks,
} from './types';
import { defaultAccountsContext } from './defaults';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import { SubscriptionsController } from 'controllers/Subscriptions';
import {
  useExtensionAccounts,
  useVaultAccounts,
} from '@w3ux/react-connect-kit';
import { useApi } from 'contexts/Api';
import type { AccountBalances } from 'model/AccountBalances';
import type { BalanceLock } from 'model/AccountBalances/types';
import BigNumber from 'bignumber.js';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';
import { useActiveTab } from 'contexts/ActiveTab';

export const Accounts = createContext<AccountsContextInterface>(
  defaultAccountsContext
);

export const useAccounts = () => useContext(Accounts);

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const { tabId, apiInstanceId } = useActiveTab();
  const { getVaultAccounts } = useVaultAccounts();
  const { getChainSpec, getApiStatus } = useApi();
  const { getExtensionAccounts } = useExtensionAccounts();

  const ownerId = tabIdToOwnerId(tabId);

  const apiStatus = getApiStatus(ownerId);
  const chainSpec = getChainSpec(ownerId);

  const accounts =
    chainSpec && chainSpec.chain
      ? getExtensionAccounts(chainSpec.ss58Prefix).concat(
          getVaultAccounts(chainSpec.chain)
        )
      : [];

  // The currently persisted account balances.
  const [accountBalances, setAccountBalancesState] =
    useState<AccountBalancesState>({});
  const accountBalancesRef = useRef(accountBalances);

  // Setter for active balances.
  const setActiveBalances = (balances: AccountBalancesState) => {
    accountBalancesRef.current = balances;
    setAccountBalancesState(balances);
  };

  // Check all accounts have been synced. App-wide syncing state for all accounts.
  const newAccountBalanceCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const { ownerId: eventOwnerId, address, balance } = e.detail;
      if (eventOwnerId !== ownerId) {
        return;
      }

      // Update state of active accounts.
      setActiveBalances({
        ...accountBalancesRef.current,
        [address]: balance,
      });
    }
  };

  // Get account balance for a specific account.
  const getAccountBalance = (address: string) => accountBalances[address];

  const handleSyncAccounts = () => {
    const subscription = SubscriptionsController?.get(
      apiInstanceId,
      'accountBalances'
    );
    if (subscription) {
      const newAccounts = accounts.map(({ address }) => address);
      (subscription as AccountBalances).syncAccounts(newAccounts);
    }
  };

  // Gets the largest lock balance, dictating the total amount of unavailable funds from locks.
  const getMaxLock = (locks: BalanceLock[]): BigNumber =>
    locks.reduce(
      (prev, current) =>
        prev.amount.isGreaterThan(current.amount) ? prev : current,
      { amount: new BigNumber(0) }
    )?.amount || new BigNumber(0);

  // Gets an account's balance's locks.
  const getBalanceLocks = (address: string | undefined): BalanceLocks => {
    if (address) {
      const maybeLocks = accountBalances[address]?.locks;
      if (maybeLocks) {
        return { locks: maybeLocks, maxLock: getMaxLock(maybeLocks) };
      }
    }

    return {
      locks: [],
      maxLock: new BigNumber(0),
    };
  };

  // Gets the amount of balance reserved for existential deposit.
  const getEdReserved = (
    address: string | undefined,
    existentialDeposit: BigNumber
  ): BigNumber => {
    const { locks, maxLock } = getBalanceLocks(address);
    if (address && locks) {
      return BigNumber.max(existentialDeposit.minus(maxLock), 0);
    }
    return new BigNumber(0);
  };

  // Sync account balances on imported accounts update or tab change. `api` instance is required in
  // subscription classes so api must be `ready` before syncing.
  useEffect(() => {
    setActiveBalances(
      (
        SubscriptionsController?.get(
          ownerId,
          'accountBalances'
        ) as AccountBalances
      )?.balances || {}
    );

    if (apiStatus === 'ready') {
      handleSyncAccounts();
    }
  }, [
    tabId,
    apiStatus === 'ready',
    JSON.stringify(accounts.map(({ address }) => address)),
  ]);

  // Listen for new account balance events.
  const documentRef = useRef<Document>(document);
  useEventListener(
    'callback-account-balance',
    newAccountBalanceCallback,
    documentRef
  );

  return (
    <Accounts.Provider
      value={{ getAccountBalance, getBalanceLocks, getEdReserved, accounts }}
    >
      {children}
    </Accounts.Provider>
  );
};
