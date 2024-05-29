// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { defaultImportedAccountsContext } from './defaults';
import type { ImportedAccountsContextInterface } from './types';
import {
  useExtensionAccounts,
  useVaultAccounts,
} from '@w3ux/react-connect-kit';

export const ImportedAccountsContext =
  createContext<ImportedAccountsContextInterface>(
    defaultImportedAccountsContext
  );

export const useImportedAccounts = () => useContext(ImportedAccountsContext);

export const ImportedAccountsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { getVaultAccounts } = useVaultAccounts();
  const { getExtensionAccounts } = useExtensionAccounts();

  const getAccounts = (chainId: string, ss58Prefix: number) =>
    getExtensionAccounts(ss58Prefix).concat(getVaultAccounts(chainId));

  // Checks whether an account can sign transactions, given a chain id and ss58 prefix.
  const accountHasSigner = (
    address: string,
    chainId: string,
    ss58Prefix: number
  ) => {
    const allAccounts = getAccounts(chainId, ss58Prefix);

    return (
      allAccounts.find(
        (account) =>
          account.address === address && account.source !== 'external' // NOTE: external accounts not yet supported.
      ) !== undefined
    );
  };

  return (
    <ImportedAccountsContext.Provider
      value={{
        getAccounts,
        accountHasSigner,
      }}
    >
      {children}
    </ImportedAccountsContext.Provider>
  );
};
