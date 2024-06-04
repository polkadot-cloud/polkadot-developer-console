// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { defaultImportedAccountsContext } from './defaults';
import type { ImportedAccountsContextInterface } from './types';
import {
  useExtensionAccounts,
  useLedgerAccounts,
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
  const { getLedgerAccounts } = useLedgerAccounts();
  const { getExtensionAccounts } = useExtensionAccounts();

  // Gets all accounts for a chain id and ss58 prefix.
  const getAccounts = (chainId: string, ss58Prefix: number) =>
    getExtensionAccounts(ss58Prefix)
      .concat(getVaultAccounts(chainId))
      .concat(getLedgerAccounts(chainId));

  // Gets one account for a chain id and ss58 prefix, or undefined if not found.
  const getAccount = (address: string, chainId: string, ss58Prefix: number) =>
    getAccounts(chainId, ss58Prefix).find((a) => a.address === address);

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

  // Checks whether an account needs manual signing.
  //
  // This is the case for accounts imported from hardware wallets, transactions of which cannot be
  // automatically signed by a provided `signer` as is the case with web extensions.
  const requiresManualSign = (
    address: string,
    chainId: string,
    ss58Prefix: number
  ) => {
    const allAccounts = getAccounts(chainId, ss58Prefix);

    return (
      allAccounts.find(
        (a) => a.address === address && ['vault', 'ledger'].includes(a.source)
      ) !== undefined
    );
  };

  return (
    <ImportedAccountsContext.Provider
      value={{
        getAccounts,
        getAccount,
        accountHasSigner,
        requiresManualSign,
      }}
    >
      {children}
    </ImportedAccountsContext.Provider>
  );
};
