// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ImportedAccount } from '@w3ux/react-connect-kit/types';
import type BigNumber from 'bignumber.js';
import type { ChainId } from 'config/networks/types';
import type { TabChainData } from 'contexts/Tabs/types';
import type { APIChainSpec, ApiInstanceId } from 'model/Api/types';

export interface AccountsProps {
  instanceId: ApiInstanceId;
  chain: TabChainData;
  chainSpec: APIChainSpec;
}

export interface AccountProps {
  instanceId: ApiInstanceId;
  account: ImportedAccount;
  chain: TabChainData;
  chainId: ChainId;
  existentialDeposit: BigNumber;
}
