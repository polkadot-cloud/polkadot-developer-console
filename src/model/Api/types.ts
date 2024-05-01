// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { ChainId } from 'config/networks';
import type { MetadataVersion } from 'controllers/Metadata/types';

// Over-arching type for the owner id. Used for api instances.
export type OwnerId = string;

// An id associated with an api instance. ChainState, ChainSpec, subscriptions, etc. all use this id
// to associate with an api instance.
export type ApiInstanceId = string;

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready';

export type EventStatus = ApiStatus | 'error' | 'destroyed' | 'fetchedSpec';

export type ErrDetail = 'InitializationError' | 'ChainSpecError';

export type ApiStatusState = Record<OwnerId, ApiStatus>;

export type ChainSpecState = Record<ApiInstanceId, APIChainSpec>;

export interface APIStatusEventDetail {
  event: EventStatus;
  ownerId: OwnerId;
  instanceId: ApiInstanceId;
  chainId: ChainId;
  err?: ErrDetail;
}

export interface APIChainSpecEventDetail {
  ownerId: OwnerId;
  spec: APIChainSpec;
  consts: Record<string, AnyJson>;
}

export interface APIChainSpec {
  chain: string | null;
  version: APIChainSpecVersion;
  ss58Prefix: number;
  magicNumber: number;
  metadata: MetadataVersion;
  consts: AnyJson;
}

export interface APIChainSpecVersion {
  apis: AnyJson;
  authoringVersion: number;
  implName: string;
  implVersion: number;
  specName: string;
  specVersion: number;
  stateVersion: number;
  transactionVersion: number;
}
