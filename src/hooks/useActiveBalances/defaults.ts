// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import BigNumber from 'bignumber.js';
import type { Balance } from 'model/AccountBalances/types';
import type { ActiveBalancesInterface } from './types';

export const defaultBalance: Balance = {
  free: new BigNumber(0),
  reserved: new BigNumber(0),
  frozen: new BigNumber(0),
};

export const defaultLocks = {
  locks: [],
  maxLock: new BigNumber(0),
};

export const defaultActiveBalances: ActiveBalancesInterface = {
  activeBalances: {},
  getLocks: (instanceId, address) => defaultLocks,
  getBalance: (instanceId, address) => defaultBalance,
  getNonce: (instanceId, address) => 0,
  getEdReserved: (instanceId, address, existentialDeposit) => new BigNumber(0),
  getNotEnoughFunds: (instanceId, address, txFees, existentialDeposit) => false,
};
