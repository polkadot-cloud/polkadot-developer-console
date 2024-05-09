// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { Api } from 'model/Api';

export interface ParaSetupContextInterface {
  getActiveStep: (tabId: number) => SetupStep;
  setActiveStep: (tabId: number, step: SetupStep) => void;
  getRelayApi: (tabId: number) => Api | undefined;
  getRelayInstanceIndex: (tabId: number) => number | undefined;
  selectedRelayChain: ChainId;
  setSelectedRelayChain: (chainId: ChainId) => void;
}

export type SetupStep =
  | 'connect_relay'
  | 'reserve_para_id'
  | 'configure_node'
  | 'register_parathread'
  | 'get_coretime';
