// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { ChainId } from 'config/networks';

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready';

export type EventStatus = ApiStatus | 'error' | 'destroyed' | 'fetchedSpec';

export interface APIStatusEventDetail {
  event: EventStatus;
  tabId: number;
  chainId: ChainId;
  err?: string;
}

export interface APIChainState {
  chain: string | null;
  version: ApiChainStateVersion;
  ss58Prefix: number;
}

export interface ApiChainStateVersion {
  apis: AnyJson;
  authoringVersion: number;
  implName: string;
  implVersion: number;
  specName: string;
  specVersion: number;
  stateVersion: number;
  transactionVersion: number;
}
