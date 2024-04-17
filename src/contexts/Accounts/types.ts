// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Balances } from 'model/AccountBalances/types';

export interface AccountsContextInterface {
  getAccountBalance: (address: string) => Balances | undefined;
}

export type AccountBalancesState = Record<string, Balances>;
