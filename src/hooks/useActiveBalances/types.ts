// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import type BigNumber from 'bignumber.js';
import type {
  AccountBalancesState,
  BalanceLocks,
} from 'contexts/Accounts/types';
import type { Balance } from 'model/AccountBalances/types';
import type { ApiInstanceId, ApiStatus } from 'model/Api/types';

export type ActiveBalancesProps = Record<ApiInstanceId, ActiveBalanceInstance>;

export interface ActiveBalanceInstance {
  accounts: string[];
  apiStatus: ApiStatus;
}

export interface ActiveBalancesInterface {
  activeBalances: AccountBalancesState;
  getLocks: (
    instanceId: ApiInstanceId | undefined,
    address: MaybeAddress
  ) => BalanceLocks;
  getBalance: (
    instanceId: ApiInstanceId | undefined,
    address: MaybeAddress
  ) => Balance;
  getEdReserved: (
    instanceId: ApiInstanceId | undefined,
    address: MaybeAddress,
    existentialDeposit: BigNumber
  ) => BigNumber;
}

export type ActiveBalances = Record<ApiInstanceId, AccountBalancesState>;
