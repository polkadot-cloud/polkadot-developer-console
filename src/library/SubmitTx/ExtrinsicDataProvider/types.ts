// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiInstanceId } from 'model/Api/types';

export interface ExtrinsicDataContextInterface {
  instanceId: ApiInstanceId;
  chainId: string;
  ss58Prefix: number;
  units: number;
  transactionVersion: string;
  unit: string;
  valid: boolean;
}
