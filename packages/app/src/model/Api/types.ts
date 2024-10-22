// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AnyJson } from '@w3ux/types';
import type { ChainId } from 'config/networks/types';
import type { MetadataVersion } from 'controllers/Metadata/types';
import type { ChainSpaceId, OwnerId } from 'types';

// NOTE: Replace with actual PAPI client interface when available.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PapiObservableClient = any;

// NOTE: Replace with actual PAPI builder interface when available.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PapiDynamicBuilder = any;

// An id associated with an api instance. ChainState, ChainSpec, subscriptions, etc. all use this id
// to associate with an api instance.
export type ApiInstanceId = string;

export type ApiStatus = 'connecting' | 'connected' | 'disconnected' | 'ready';

export type EventStatus = ApiStatus | 'error' | 'destroyed';

export type ErrDetail = 'InitializationError' | 'ChainSpecError';

export type ApiStatusState = Record<ApiInstanceId, ApiStatus>;

export type ChainSpecState = Record<ApiInstanceId, APIChainSpec>;

export interface APIStatusEventDetail {
  event: EventStatus;
  chainSpaceId: ChainSpaceId;
  ownerId: OwnerId;
  instanceId: ApiInstanceId;
  chainId: ChainId;
  err?: ErrDetail;
}

export interface APIChainSpecEventDetail {
  chainSpaceId: ChainSpaceId;
  ownerId: OwnerId;
  instanceId: ApiInstanceId;
  spec: APIChainSpec | undefined;
  consts: Record<string, AnyJson>;
}

export interface APIChainSpec {
  chain: string | null;
  version: APIChainSpecVersion;
  ss58Prefix: number;
  metadata: MetadataVersion | AnyJson; // NOTE: This could be improved, but no significant impact on the app.
  consts: AnyJson;
}

export interface APIChainSpecVersion {
  apis: AnyJson;
  authoringVersion: number;
  implName: string;
  implVersion: number;
  specName: ChainId;
  specVersion: number;
  stateVersion: number;
  transactionVersion: number;
}
