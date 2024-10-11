// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ImportedAccount } from '@w3ux/react-connect-kit/types';
import type BigNumber from 'bignumber.js';
import type { ActiveBalancesInterface } from 'hooks/useActiveBalances/types';
import type { BalanceLock, Balances } from 'model/AccountBalances/types';
import type { APIChainSpec } from 'model/Api/types';

export type AccountsContextInterface = ActiveBalancesInterface & {
  getAccounts: (chainSpec?: APIChainSpec) => ImportedAccount[];
};

// Account balances, keyed by address.
export type AccountBalancesState = Record<string, Balances>;

export interface BalanceLocks {
  locks: BalanceLock[];
  maxLock: BigNumber;
}
