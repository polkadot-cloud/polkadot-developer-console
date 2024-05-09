// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { TabAccountsContextInterface } from './types';
import { defaultTabAccountsContext } from './defaults';
import { useApi } from 'contexts/Api';
import { useActiveTab } from 'contexts/ActiveTab';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useActiveBalances } from 'hooks/useActiveBalances';
import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import type BigNumber from 'bignumber.js';

export const TabAccounts = createContext<TabAccountsContextInterface>(
  defaultTabAccountsContext
);

export const useTabAccounts = () => useContext(TabAccounts);

export const TabAccountsProvider = ({ children }: { children: ReactNode }) => {
  const { apiInstanceId } = useActiveTab();
  const { getAccounts } = useImportedAccounts();
  const { getChainSpec, getApiStatus } = useApi();

  const apiStatus = getApiStatus(apiInstanceId);
  const chainSpec = getChainSpec(apiInstanceId);

  // Get all imported accounts if chain spec is available.
  const accounts =
    chainSpec && chainSpec.chain
      ? getAccounts(chainSpec.chain, chainSpec.ss58Prefix)
      : [];

  // Instance config to be provided to active balances.
  const activeBalanceInstance = {
    [apiInstanceId]: {
      accounts: accounts.map(({ address }) => address),
      apiStatus,
    },
  };

  // Get tab account balances and listen for updates.
  const activeBalances = useActiveBalances(activeBalanceInstance);

  // Get balances from `activeBalances` at this api instance id.
  const getBalance = (address: MaybeAddress) =>
    activeBalances.getBalance(apiInstanceId, address);

  // Gets locks from `activeBalances` at this api instance id.
  const getLocks = (address: MaybeAddress) =>
    activeBalances.getLocks(apiInstanceId, address);

  // Gets edReserved from `activeBalances` at this api instance id.
  const getEdReserved = (
    address: MaybeAddress,
    existentialDeposit: BigNumber
  ) => activeBalances.getEdReserved(apiInstanceId, address, existentialDeposit);

  return (
    <TabAccounts.Provider
      value={{
        getBalance,
        getLocks,
        getEdReserved,
        accounts,
      }}
    >
      {children}
    </TabAccounts.Provider>
  );
};
