// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import BigNumber from 'bignumber.js';
import type { TabAccountsContextInterface } from './types';
import { defaultBalance } from 'hooks/useActiveBalances/defaults';

export const defaultTabAccountsContext: TabAccountsContextInterface = {
  getAccountBalance: (address) => defaultBalance,
  getLocks: (address) => ({ locks: [], maxLock: new BigNumber(0) }),
  getEdReserved: (address, existentialDeposit) => new BigNumber(0),
  accounts: [],
};
