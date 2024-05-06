// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ImportedAccount,
  MaybeAddress,
} from '@w3ux/react-connect-kit/types';
import type BigNumber from 'bignumber.js';
import type {
  Balance,
  BalanceLock,
  Balances,
} from 'model/AccountBalances/types';

export interface TabAccountsContextInterface {
  getBalance: (address: MaybeAddress) => Balance;
  getLocks: (address: MaybeAddress) => BalanceLocks;
  getEdReserved: (
    address: MaybeAddress,
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
