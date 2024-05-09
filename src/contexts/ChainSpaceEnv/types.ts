// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { ActiveBalancesInterface } from 'hooks/useActiveBalances/types';
import type { Api } from 'model/Api';
import type { APIChainSpec, ApiInstanceId, ApiStatus } from 'model/Api/types';

export interface ChainSpaceEnvContextInterface {
  activeBalances: ActiveBalancesInterface;
  relayInstance: Api | undefined;
  getApiInstanceIndex: (index: number) => number | undefined;
  setApiInstanceIndex: (index: number, instanceIndex: number) => void;
  relayApiStatus: ApiStatus;
  relayInstanceIndex: number | undefined;
  handleConnectApi: (
    index: number,
    chainId: ChainId,
    provider: string
  ) => Promise<void>;
}

export interface ChainSpaceEnvProps {
  children: React.ReactNode;
  chains?: Record<number, ChainId>;
}

export type ChainSpaceChainSpecs = Record<ApiInstanceId, APIChainSpec>;

export type ChainSpaceApiStatuses = Record<ApiInstanceId, ApiStatus>;
