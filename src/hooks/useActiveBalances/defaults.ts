// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js';
import type { Balance } from 'model/AccountBalances/types';

export const defaultBalance: Balance = {
  free: new BigNumber(0),
  reserved: new BigNumber(0),
  frozen: new BigNumber(0),
};
