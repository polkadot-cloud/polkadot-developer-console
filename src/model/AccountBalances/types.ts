// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { ChainId } from 'config/networks';

export interface Balances {
  nonce?: number;
  balance?: Balance;
  locks?: BalanceLock[];
}

export interface Balance {
  free: BigNumber;
  reserved: BigNumber;
  frozen: BigNumber;
}

export interface BalanceLock {
  id: string;
  amount: BigNumber;
  reasons: string;
}

export interface AccountBalanceEventDetail {
  ownerId: number;
  chainId: ChainId;
  address: string;
  balance: Balances;
}
