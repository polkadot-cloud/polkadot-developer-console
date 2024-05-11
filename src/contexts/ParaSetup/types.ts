// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';

export interface ParaSetupContextInterface {
  getActiveStep: (tabId: number) => SetupStep;
  setActiveStep: (tabId: number, step: SetupStep) => void;
  getChainSpaceApiIndex: (tabId: number) => ChainSpaceIndex | undefined;
  setChainSpaceApiIndex: (tabId: number, index: ChainSpaceIndex) => void;
  getSelectedRelayChain: (tabId: number) => ChainId;
  setSelectedRelayChain: (tabId: number, chainId: ChainId) => void;
  getConfirmedRelayChain: (tabId: number) => ChainId | undefined;
  setConfirmedRelayChain: (tabId: number, chainId: ChainId) => void;
  removeChainSpaceApiIndex: (tabId: number) => void;
  destroyTabParaSetup: (tabId: number) => void;
}

export type SetupStep =
  | 'connect_relay'
  | 'reserve_para_id'
  | 'configure_node'
  | 'register_parathread'
  | 'get_coretime';

export type SetupStepsState = Record<number, SetupStep>;

export type SelectedRelayChains = Record<number, ChainId>;

export type ChainSpaceApiIndexes = Record<number, ChainSpaceIndex>;

export interface ChainSpaceIndex {
  index: number;
  label: string;
}
