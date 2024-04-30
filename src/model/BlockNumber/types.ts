// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';

export interface BlockNumberEventDetail {
  blockNumber: number;
  chainId: ChainId;
  ownerId: number;
}
