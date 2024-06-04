// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { AccountsContextInterface } from './types';
import { defaultAccountsContext } from './defaults';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useActiveBalances } from 'hooks/useActiveBalances';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useApiIndexer } from 'contexts/ApiIndexer';
import { useActiveTab } from 'contexts/ActiveTab';
import type { APIChainSpec } from 'model/Api/types';
import type { ActiveBalancesProps } from 'hooks/useActiveBalances/types';

export const Accounts = createContext<AccountsContextInterface>(
  defaultAccountsContext
);

export const useAccounts = () => useContext(Accounts);

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const { ownerId } = useActiveTab();
  const { getTabApiIndexes } = useApiIndexer();
  const { getApiStatus, getChainSpec } = useChainSpaceEnv();
  const { getAccounts: getImportedAccounts } = useImportedAccounts();

  // Get accounts given a chain spec.
  const getAccounts = (chainSpec?: APIChainSpec) =>
    chainSpec
      ? getImportedAccounts(chainSpec.version.specName, chainSpec.ss58Prefix)
      : [];

  // Accumulate active balance configuration from api indexes for the current tab.
  const activeBalanceInstances: ActiveBalancesProps = {};
  Object.values(getTabApiIndexes(ownerId)).forEach(({ index }) => {
    const instanceId = `${ownerId}_${index}`;
    const chainSpec = getChainSpec(instanceId);

    if (chainSpec) {
      const accounts = chainSpec ? getAccounts(chainSpec) : [];

      activeBalanceInstances[instanceId] = {
        accounts: accounts.map(({ address }) => address),
        apiStatus: getApiStatus(instanceId),
      };
    }
  });

  // Get active account balances for all api instances associated with the current tab.
  const activeBalances = useActiveBalances(activeBalanceInstances);

  return (
    <Accounts.Provider
      value={{
        getAccounts,
        ...activeBalances,
      }}
    >
      {children}
    </Accounts.Provider>
  );
};
