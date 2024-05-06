// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import type BigNumber from 'bignumber.js';
import type {
  AccountBalancesState,
  BalanceLocks,
} from 'contexts/TabAccounts/types';
import type { Balance } from 'model/AccountBalances/types';

export interface ActiveBalancesInterface {
  activeBalances: AccountBalancesState;
  getLocks: (address: MaybeAddress) => BalanceLocks;
  getBalance: (address: MaybeAddress) => Balance;
  getEdReserved: (
    address: MaybeAddress,
    existentialDeposit: BigNumber
  ) => BigNumber;
}
