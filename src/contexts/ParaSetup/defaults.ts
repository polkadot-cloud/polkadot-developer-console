// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ParaSetupContextInterface, SetupStep } from './types';

export const defaultParaSetupContext: ParaSetupContextInterface = {
  getActiveStep: (tabId) => 'connect_relay',
  setActiveStep: (tabId, step) => {},
  getChainSpaceApiIndex: (tabId) => undefined,
  setChainSpaceApiIndex: (tabId, index) => {},
  getSelectedRelayChain: (tabId) => 'polkadot',
  setSelectedRelayChain: (tabId, chainId) => {},
  getConfirmedRelayChain: (tabId) => undefined,
  setConfirmedRelayChain: (tabId, chainId) => {},
  removeChainSpaceApiIndex: (tabId) => {},
  destroyTabParaSetup: (tabId) => {},
};

export const setupSteps: SetupStep[] = [
  'connect_relay',
  'reserve_para_id',
  'configure_node',
  'register_parathread',
  'get_coretime',
];
