// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import { useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import BigNumber from 'bignumber.js';
import { isCustomEvent } from 'Utils';
import type {
  AccountBalancesState,
  BalanceLocks,
} from 'contexts/TabAccounts/types';
import type { BalanceLock } from 'model/AccountBalances/types';
import type { AnyJson } from '@w3ux/utils/types';
import type { ApiInstanceId, ApiStatus } from 'model/Api/types';
import { defaultBalance } from './defaults';
import { SubscriptionsController } from 'controllers/Subscriptions';
import type { AccountBalances } from 'model/AccountBalances';

export const useActiveBalances = ({
  accounts,
  apiInstanceId,
  apiStatus,
  dependencies,
}: {
  accounts: string[];
  apiInstanceId: ApiInstanceId;
  apiStatus: ApiStatus;
  dependencies: AnyJson[];
}) => {
  // Ensure no account duplicates.
  const uniqueAccounts = [...new Set(accounts)];

  // Store active account balances state. Requires ref for use in event listener callbacks.
  const [activeBalances, setActiveBalances] = useState<AccountBalancesState>(
    {}
  );
  const activeBalancesRef = useRef(activeBalances);

  // Gets an active balance's balance.
  const getBalance = (address: MaybeAddress) => {
    if (address) {
      const maybeBalance = activeBalances[address]?.balance;
      if (maybeBalance) {
        return maybeBalance;
      }
    }
    return defaultBalance;
  };

  // Gets the largest lock balance, dictating the total amount of unavailable funds from locks.
  const getMaxLock = (locks: BalanceLock[]): BigNumber =>
    locks.reduce(
      (prev, current) =>
        prev.amount.isGreaterThan(current.amount) ? prev : current,
      { amount: new BigNumber(0) }
    )?.amount || new BigNumber(0);

  // Gets an active balance's locks.
  const getLocks = (address: MaybeAddress): BalanceLocks => {
    if (address) {
      const maybeLocks = activeBalances[address]?.locks;
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
    address: MaybeAddress,
    existentialDeposit: BigNumber
  ): BigNumber => {
    const { locks, maxLock } = getLocks(address);
    if (address && locks) {
      return BigNumber.max(existentialDeposit.minus(maxLock), 0);
    }
    return new BigNumber(0);
  };

  // Check all accounts have been synced. App-wide syncing state for all accounts.
  const newAccountBalanceCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const { instanceId, address, balance } = e.detail;
      if (instanceId === apiInstanceId) {
        return;
      }

      // Update state of active accounts.
      setActiveBalances({
        ...activeBalancesRef.current,
        [address]: balance,
      });
    }
  };

  const handleSyncAccounts = () => {
    const subscription = SubscriptionsController?.get(
      apiInstanceId,
      'accountBalances'
    );
    if (subscription) {
      (subscription as AccountBalances).syncAccounts(uniqueAccounts);
    }
  };

  // Sync account balances on imported accounts update or tab change. `api` instance is required in
  // subscription classes so api must be `ready` before syncing.
  useEffect(() => {
    setActiveBalances(
      (
        SubscriptionsController?.get(
          apiInstanceId,
          'accountBalances'
        ) as AccountBalances
      )?.balances || {}
    );

    if (apiStatus === 'ready') {
      handleSyncAccounts();
    }
  }, [...dependencies, apiStatus, JSON.stringify(uniqueAccounts)]);

  // Listen for new account balance events.
  const documentRef = useRef<Document>(document);

  useEventListener(
    'callback-account-balance',
    newAccountBalanceCallback,
    documentRef
  );

  return {
    activeBalances,
    getLocks,
    getBalance,
    getEdReserved,
  };
};
