// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { ActiveBalancesInterface } from 'hooks/useActiveBalances/types';
import type { Api } from 'model/Api';
import type { APIChainSpec, ApiInstanceId, ApiStatus } from 'model/Api/types';
import type { OwnerId } from 'types';

export interface ChainSpaceEnvContextInterface {
  getApiStatus: (instanceId?: ApiInstanceId) => ApiStatus;
  getChainSpec: (instanceId?: ApiInstanceId) => APIChainSpec | undefined;
  activeBalances: ActiveBalancesInterface;
  handleConnectApi: (
    ownerId: OwnerId,
    label: string,
    chainId: ChainId,
    provider: string
  ) => Promise<void>;
  getChainApi: (ownerId: OwnerId, label: string) => Api | undefined;
  destroyChainApi: (ownerId: OwnerId, label: string) => void;
  destroyOwnerApis: (ownerId: OwnerId) => void;
  destroyChainSpaceEnvIndex: (ownerId: OwnerId, index: number) => void;
}

export interface ChainSpaceEnvProps {
  children: React.ReactNode;
  chains?: Record<number, ChainId>;
}

export type TabToApiIndexes = Record<number, number[]>;

export type ChainSpaceChainSpecs = Record<ApiInstanceId, APIChainSpec>;

export type ChainSpaceApiStatuses = Record<ApiInstanceId, ApiStatus>;
