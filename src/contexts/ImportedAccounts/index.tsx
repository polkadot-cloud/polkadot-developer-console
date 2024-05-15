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

  return (
    <ImportedAccountsContext.Provider
      value={{
        getAccounts,
      }}
    >
      {children}
    </ImportedAccountsContext.Provider>
  );
};
