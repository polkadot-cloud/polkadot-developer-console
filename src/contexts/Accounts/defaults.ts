// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { AccountsContextInterface } from './types';

export const defaultAccountsContext: AccountsContextInterface = {
  getAccountBalance: (address) => undefined,
};
