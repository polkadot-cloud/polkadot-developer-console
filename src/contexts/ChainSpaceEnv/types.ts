// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { ActiveBalancesInterface } from 'hooks/useActiveBalances/types';
import type { Api } from 'model/Api';
import type { APIChainSpec, ApiInstanceId, ApiStatus } from 'model/Api/types';

export interface ChainSpaceEnvContextInterface {
  activeBalances: ActiveBalancesInterface;
  handleConnectApi: (chainId: ChainId, provider: string) => Promise<number>;
  getChainApi: (index: number | undefined) => Api | undefined;
  destroyChainApi: (index: number) => void;
  getApiStatusByIndex: (index: number | undefined) => ApiStatus;
}

export interface ChainSpaceEnvProps {
  children: React.ReactNode;
  chains?: Record<number, ChainId>;
}

export type ChainSpaceChainSpecs = Record<ApiInstanceId, APIChainSpec>;

export type ChainSpaceApiStatuses = Record<ApiInstanceId, ApiStatus>;
