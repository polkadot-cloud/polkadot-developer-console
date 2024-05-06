// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ImportedAccount } from '@w3ux/react-connect-kit/types';
import type BigNumber from 'bignumber.js';
import type { BalanceLock, Balances } from 'model/AccountBalances/types';

export interface TabAccountsContextInterface {
  getAccountBalance: (address: string) => Balances | undefined;
  getBalanceLocks: (address: string | undefined) => BalanceLocks;
  getEdReserved: (
    address: string | undefined,
    existentialDeposit: BigNumber
  ) => BigNumber;
  accounts: ImportedAccount[];
}

// Account balances, keyed by address.
export type AccountBalancesState = Record<string, Balances>;

export interface BalanceLocks {
  locks: BalanceLock[];
  maxLock: BigNumber;
}
