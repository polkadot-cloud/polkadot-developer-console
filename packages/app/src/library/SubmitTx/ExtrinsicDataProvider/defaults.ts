// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
