// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { AccountBalancesState, AccountsContextInterface } from './types';
import { defaultAccountsContext } from './defaults';
import { useTabs } from 'contexts/Tabs';
import { useEventListener } from 'usehooks-ts';
import { isCustomEvent } from 'Utils';
import { SubscriptionsController } from 'controllers/Subscriptions';
import {
  useExtensionAccounts,
  useVaultAccounts,
} from '@w3ux/react-connect-kit';
import { useApi } from 'contexts/Api';
import type { AccountBalances } from 'model/AccountBalances';

export const Accounts = createContext<AccountsContextInterface>(
  defaultAccountsContext
);

export const useAccounts = () => useContext(Accounts);

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const { selectedTabId } = useTabs();
  const { getVaultAccounts } = useVaultAccounts();
  const { getChainSpec, getApiStatus } = useApi();
  const { getExtensionAccounts } = useExtensionAccounts();

  const apiStatus = getApiStatus(selectedTabId);
  const chainSpec = getChainSpec(selectedTabId);
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
      const { address, balance, tabId } = e.detail;
      if (tabId !== selectedTabId) {
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
      selectedTabId,
      'accountBalances'
    );
    if (subscription) {
      const newAccounts = accounts.map(({ address }) => address);
      (subscription as AccountBalances).syncAccounts(newAccounts);
    }
  };

  // Sync account balances on imported accounts update or tab change. `api` instance is required in
  // subscription classes so api must be `ready` before syncing.
  useEffect(() => {
    setActiveBalances(
      (
        SubscriptionsController?.get(
          selectedTabId,
          'accountBalances'
        ) as AccountBalances
      )?.balances || {}
    );

    if (apiStatus === 'ready') {
      handleSyncAccounts();
    }
  }, [
    selectedTabId,
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
    <Accounts.Provider value={{ getAccountBalance }}>
      {children}
    </Accounts.Provider>
  );
};
