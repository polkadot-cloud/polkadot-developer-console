// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';

export interface ParaSetupContextInterface {
  getActiveStep: (tabId: number) => SetupStep;
  setActiveStep: (tabId: number, step: SetupStep) => void;
  getChainSpaceApiIndex: (tabId: number) => number | undefined;
  setChainSpaceApiIndex: (tabId: number, index: number) => void;
  getSelectedRelayChain: (tabId: number) => ChainId;
  setSelectedRelayChain: (tabId: number, chainId: ChainId) => void;
}

export type SetupStep =
  | 'connect_relay'
  | 'reserve_para_id'
  | 'configure_node'
  | 'register_parathread'
  | 'get_coretime';
