// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { ActiveBalancesInterface } from 'hooks/useActiveBalances/types';
import type { Api } from 'model/Api';
import type { APIChainSpec, ApiInstanceId, ApiStatus } from 'model/Api/types';

export interface ChainSpaceEnvContextInterface {
  getApiStatusByIndex: (index: number | undefined) => ApiStatus;
  getApiActive: (tabId: number, label: string) => boolean;
  getChainSpecByIndex: (index: number | undefined) => APIChainSpec | undefined;
  activeBalances: ActiveBalancesInterface;
  handleConnectApi: (
    tabId: number,
    label: string,
    chainId: ChainId,
    provider: string
  ) => Promise<void>;
  getChainApi: (tabId: number, label: string) => Api | undefined;
  destroyChainApi: (tabId: number, label: string) => void;
  destroyChainSpaceEnvIndex: (index: number) => void;
}

export interface ChainSpaceEnvProps {
  children: React.ReactNode;
  chains?: Record<number, ChainId>;
}

export type TabToApiIndexes = Record<number, number[]>;

export type ChainSpaceChainSpecs = Record<ApiInstanceId, APIChainSpec>;

export type ChainSpaceApiStatuses = Record<ApiInstanceId, ApiStatus>;
