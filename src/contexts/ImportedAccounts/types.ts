// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ImportedAccount } from '@w3ux/react-connect-kit/types';

export interface ImportedAccountsContextInterface {
  getAccounts: (chainId: string, ss58Preifx: number) => ImportedAccount[];
  accountHasSigner: (
    address: string,
    chainId: string,
    ss58Prefix: number
  ) => boolean;
}
