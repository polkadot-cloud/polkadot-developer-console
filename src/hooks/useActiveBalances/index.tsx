// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import { useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import BigNumber from 'bignumber.js';
import { isCustomEvent } from 'Utils';
import type { BalanceLocks } from 'contexts/Accounts/types';
import type { BalanceLock } from 'model/AccountBalances/types';
import type { ApiInstanceId } from 'model/Api/types';
import { defaultBalance } from './defaults';
import { SubscriptionsController } from 'controllers/Subscriptions';
import type { AccountBalances } from 'model/AccountBalances';
import type {
  ActiveBalances,
  ActiveBalancesInterface,
  ActiveBalancesProps,
} from './types';

export const useActiveBalances = (
  instances: ActiveBalancesProps
): ActiveBalancesInterface => {
  // Get api instance ids from instances, if any.
  const instanceIds = Object.keys(instances) || [];

  // The initial state of active account balances is a map between api instance id and balance data,
  // which is initially empty.
  const initialBalances: ActiveBalances = {};
  instanceIds.forEach((instanceId) => {
    initialBalances[instanceId] = {};
  });

  // Gets a concatenation of the accounts supplied for each instance of this hook. Also Ensures no
  // account duplicates. This value is stringified and used with useEffect to re-render on account
  // updates.
  const uniqueAccounts = Object.values(instances).map(({ accounts }) => [
    ...new Set(accounts),
  ]);

  // Gets a concatenation of each apiStatus of the instances of this hook. This value is stringified
  // and used with useEffect to re-render on account updates.
  const apiStatuses = Object.values(instances).map(
    ({ apiStatus }) => apiStatus
  );

  // Store active account balances state. Requires ref for use in event listener callbacks.
  const [activeBalances, setActiveBalancesState] =
    useState<ActiveBalances>(initialBalances);
  const activeBalancesRef = useRef(activeBalances);

  // Setter for active balances.
  const setActiveBalances = (balances: ActiveBalances) => {
    activeBalancesRef.current = balances;
    setActiveBalancesState(balances);
  };

  // Gets an active balance's balance.
  const getBalance = (
    instanceId: ApiInstanceId | undefined,
    address: MaybeAddress
  ) => {
    if (address && instanceId !== undefined) {
      const maybeBalance = activeBalances[instanceId]?.[address]?.balance;
      if (maybeBalance) {
        return maybeBalance;
      }
    }
    return defaultBalance;
  };

  // Gets an account's nonce.
  const getNonce = (
    instanceId: ApiInstanceId | undefined,
    address: MaybeAddress
  ) => {
    if (address && instanceId !== undefined) {
      const maybeNonce = activeBalances[instanceId]?.[address]?.nonce;
      if (maybeNonce) {
        return maybeNonce;
      }
    }
    return 0;
  };

  // Gets the largest lock balance, dictating the total amount of unavailable funds from locks.
  const getMaxLock = (locks: BalanceLock[]): BigNumber =>
    locks.reduce(
      (prev, current) =>
        prev.amount.isGreaterThan(current.amount) ? prev : current,
      { amount: new BigNumber(0) }
    )?.amount || new BigNumber(0);

  // Gets an active balance's locks.
  const getLocks = (
    instanceId: ApiInstanceId | undefined,
    address: MaybeAddress
  ): BalanceLocks => {
    if (address && instanceId !== undefined) {
      const maybeLocks = activeBalances[instanceId]?.[address]?.locks;
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
    instanceId: ApiInstanceId | undefined,
    address: MaybeAddress,
    existentialDeposit: BigNumber
  ): BigNumber => {
    const { locks, maxLock } = getLocks(instanceId, address);
    if (address && locks) {
      return BigNumber.max(existentialDeposit.minus(maxLock), 0);
    }
    return new BigNumber(0);
  };

  // Gets whether an account has enough funds to pay for tx fees.
  const getNotEnoughFunds = (
    instanceId: ApiInstanceId | undefined,
    address: string,
    txFees: BigNumber,
    existentialDeposit: BigNumber
  ) => {
    const { free, frozen } = getBalance(instanceId, address);
    const edReserved = getEdReserved(instanceId, address, existentialDeposit);
    const balanceforTxFees = free.minus(edReserved).minus(frozen);

    return balanceforTxFees.minus(txFees).isLessThan(0);
  };

  // Callback for new account balance events.
  const newAccountBalanceCallback = (e: Event) => {
    if (isCustomEvent(e)) {
      const { instanceId, address, balance } = e.detail;
      if (!instanceIds.includes(instanceId)) {
        return;
      }

      // Update active balances state.
      const updated = { ...activeBalancesRef.current };
      if (!updated[instanceId]) {
        updated[instanceId] = {};
      }

      updated[instanceId][address] = balance;
      setActiveBalances(updated);
    }
  };

  // Attempt to get the active balances for the provided api instance.
  const handleSyncAccounts = (instanceId: ApiInstanceId) => {
    const instanceBalances =
      (
        SubscriptionsController?.get(
          instanceId,
          'accountBalances'
        ) as AccountBalances
      )?.balances || {};

    // Apply current active balances to state.
    const updated = { ...activeBalancesRef.current };
    updated[instanceId] = instanceBalances;

    if (['ready'].includes(getApiStatus(instanceId))) {
      setActiveBalances(updated);
      const subscription = SubscriptionsController?.get(
        instanceId,
        'accountBalances'
      );
      if (subscription) {
        (subscription as AccountBalances).syncAccounts(
          getInstanceAccounts(instanceId)
        );
      }
    } else {
      // Reset state if instance id is not available.
      updated[instanceId] = {};
      setActiveBalances(updated);
    }
  };

  // Gets the accounts from an instance.
  const getInstanceAccounts = (instanceId: ApiInstanceId) => [
    ...new Set(instances[instanceId]?.accounts || []),
  ];

  // Gets the api status from an instance.
  const getApiStatus = (instanceId: ApiInstanceId) =>
    instances[instanceId]?.apiStatus || 'disconnected';

  // Sync active balances on either account changes, api status changes or api instance changes.
  // `api` instance is required in subscription classes so api must be `ready` before syncing.
  useEffect(() => {
    for (const instanceId of instanceIds) {
      handleSyncAccounts(instanceId);
    }
  }, [
    JSON.stringify(apiStatuses),
    JSON.stringify(instanceIds),
    JSON.stringify(uniqueAccounts),
  ]);

  // Listen for new account balance events.
  const documentRef = useRef<Document>(document);

  useEventListener(
    'callback-account-balance',
    newAccountBalanceCallback,
    documentRef
  );

  return {
    activeBalances,
    getBalance,
    getNonce,
    getLocks,
    getEdReserved,
    getNotEnoughFunds,
  };
};
