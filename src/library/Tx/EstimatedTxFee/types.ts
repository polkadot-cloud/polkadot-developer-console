// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiInstanceId } from 'model/Api/types';

export interface EstimatedTxFeeProps {
  instanceId: ApiInstanceId;
  unit: string;
  units: number;
  format?: string;
}
