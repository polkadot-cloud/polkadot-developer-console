// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { ApiInstanceId } from 'model/Api/types';
import type { OwnerId } from 'types';

export interface BlockNumberEventDetail {
  ownerId: OwnerId;
  instanceId: ApiInstanceId;
  chainId: ChainId;
  blockNumber: number;
}
