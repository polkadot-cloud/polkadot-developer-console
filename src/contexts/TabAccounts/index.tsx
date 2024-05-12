// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { TabAccountsContextInterface } from './types';
import { defaultTabAccountsContext } from './defaults';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useActiveBalances } from 'hooks/useActiveBalances';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useApiIndexer } from 'contexts/ApiIndexer';
import { useActiveTab } from 'contexts/ActiveTab';
import type { APIChainSpec } from 'model/Api/types';

export const TabAccounts = createContext<TabAccountsContextInterface>(
  defaultTabAccountsContext
);

export const useTabAccounts = () => useContext(TabAccounts);

export const TabAccountsProvider = ({ children }: { children: ReactNode }) => {
  const { ownerId } = useActiveTab();
  const { getTabApiIndex } = useApiIndexer();
  const { getAccounts: getImportedAccounts } = useImportedAccounts();
  const { getApiStatus, getChainSpec } = useChainSpaceEnv();

  const apiInstanceId = getTabApiIndex(ownerId, 'chainBrowser')?.instanceId;
  const apiStatus = getApiStatus(apiInstanceId);
  const chainSpec = getChainSpec(apiInstanceId);

  // Get accounts given a chainSpec.
  const getAccounts = (spec?: APIChainSpec) =>
    spec && spec.chain ? getImportedAccounts(spec.chain, spec.ss58Prefix) : [];

  // Get all imported accounts if chain spec is available.
  const accounts =
    chainSpec && chainSpec.chain
      ? getImportedAccounts(chainSpec.chain, chainSpec.ss58Prefix)
      : [];

  // Instance config to be provided to active balances.
  const activeBalanceInstance = apiInstanceId
    ? {
        [apiInstanceId]: {
          accounts: accounts.map(({ address }) => address),
          apiStatus,
        },
      }
    : {};

  // Get tab account balances and listen for updates.
  const activeBalances = useActiveBalances(activeBalanceInstance);

  return (
    <TabAccounts.Provider
      value={{
        getAccounts,
        ...activeBalances,
      }}
    >
      {children}
    </TabAccounts.Provider>
  );
};
