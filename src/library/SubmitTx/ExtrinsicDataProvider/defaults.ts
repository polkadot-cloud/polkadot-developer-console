// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ExtrinsicDataContextInterface } from './types';

export const defaultExtrinsicDataContext: ExtrinsicDataContextInterface = {
  instanceId: '',
  chainId: '',
  ss58Prefix: 0,
  units: 10,
  transactionVersion: '0',
  unit: 'UNIT',
  valid: false,
};
