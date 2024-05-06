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

  // Get tab account balances from `useActiveBalances`.
  const { getLocks, getBalance, getEdReserved } = useActiveBalances({
    accounts: accounts.map(({ address }) => address),
    apiInstanceId,
    apiStatus,
    dependencies: [apiInstanceId],
  });

  return (
    <TabAccounts.Provider
      value={{
        getAccountBalance: getBalance,
        getLocks,
        getEdReserved,
        accounts,
      }}
    >
      {children}
    </TabAccounts.Provider>
  );
};
