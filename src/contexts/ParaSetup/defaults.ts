// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ParaSetupContextInterface, SetupStep } from './types';

export const defaultParaSetupContext: ParaSetupContextInterface = {
  handleConnectTask: (tabId, chainId, endpoint) => Promise.resolve(),
  getActiveStep: (tabId) => 'connect_relay',
  setActiveStep: (tabId, step) => {},
  getSelectedRelayChain: (tabId) => undefined,
  setSelectedRelayChain: (tabId, chainId) => {},
  destroyTabParaSetup: (tabId) => {},
  setupParachainIntegrityCheck: (tabId) => false,
  getNextParaId: (chainId) => undefined,
  setNextParaId: (chainId, paraId) => {},
  removeNextParaId: (chainId) => {},
  nextParaIdChainExists: (chainId) => false,
  addNextParaIdchain: (chainId) => {},
};

export const setupSteps: SetupStep[] = [
  'connect_relay',
  'reserve_para_id',
  'configure_node',
  'register_parathread',
  'get_coretime',
];
