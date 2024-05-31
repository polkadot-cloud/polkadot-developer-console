// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiInstanceId } from 'model/Api/types';

export interface EstimatedTxFeeProps {
  instanceId: ApiInstanceId;
  unit: string;
  units: number;
  format?: string;
}
