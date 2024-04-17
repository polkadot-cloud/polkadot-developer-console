// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { BalanceLock, Balances } from 'model/AccountBalances/types';

export interface AccountsContextInterface {
  getAccountBalance: (address: string) => Balances | undefined;
  getBalanceLocks: (address: string | undefined) => BalanceLocks;
  getEdReserved: (
    address: string | undefined,
    existentialDeposit: BigNumber
  ) => BigNumber;
}

export type AccountBalancesState = Record<string, Balances>;

export interface BalanceLocks {
  locks: BalanceLock[];
  maxLock: BigNumber;
}
