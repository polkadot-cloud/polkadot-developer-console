// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ImportedAccount } from '@w3ux/react-connect-kit/types';
import type BigNumber from 'bignumber.js';
import type { ChainId } from 'config/networks';

export interface AccountProps {
  account: ImportedAccount;
  chainId?: ChainId;
  existentialDeposit: BigNumber;
}
