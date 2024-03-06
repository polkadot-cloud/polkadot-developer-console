// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready';

export type EventStatus = ApiStatus | 'error' | 'destroyed';

export interface APIStatusEventDetail {
  event: EventStatus;
  tabId: number;
  chainId: ChainId;
  err?: string;
}
