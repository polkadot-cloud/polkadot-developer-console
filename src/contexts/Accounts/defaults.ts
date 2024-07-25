// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { AccountsContextInterface } from './types';
import { defaultActiveBalances } from 'hooks/useActiveBalances/defaults';

export const defaultAccountsContext: AccountsContextInterface = {
  ...defaultActiveBalances,
  getAccounts: (chainSpec) => [],
};
