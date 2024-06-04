// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks/types';
import type { ApiIndexLabel } from 'contexts/ApiIndexer/types';
import type { Api } from 'model/Api';
import type { APIChainSpec, ApiInstanceId, ApiStatus } from 'model/Api/types';
import type { OwnerId } from 'types';

export interface ChainSpaceEnvContextInterface {
  handleConnectApi: (
    ownerId: OwnerId,
    label: ApiIndexLabel,
    chainId: ChainId,
    provider: string
  ) => Promise<void>;
  getApiStatus: (instanceId?: ApiInstanceId) => ApiStatus;
  getChainSpec: (instanceId?: ApiInstanceId) => APIChainSpec | undefined;
  getPalletVersions: (ownerId: OwnerId) => Record<string, string> | undefined;
  getApiInstanceById: (instanceId: ApiInstanceId) => Api | undefined;
  getApiInstance: (ownerId: OwnerId, label: ApiIndexLabel) => Api | undefined;
  destroyApiInstance: (ownerId: OwnerId, label: ApiIndexLabel) => void;
  destroyAllApiInstances: (ownerId: OwnerId) => void;
  instantiateApiFromTab: (tabId: number) => void;
}

export interface ChainSpaceEnvProps {
  children: React.ReactNode;
  chains?: Record<number, ChainId>;
}

export type TabToApiIndexes = Record<number, number[]>;

export type ChainSpaceChainSpecs = Record<ApiInstanceId, APIChainSpec>;

export type ChainSpaceApiStatuses = Record<ApiInstanceId, ApiStatus>;

// Store versions of pallets. {ownerId: { palletName: version }}.
export type PalletVersions = Record<OwnerId, Record<string, string>>;
