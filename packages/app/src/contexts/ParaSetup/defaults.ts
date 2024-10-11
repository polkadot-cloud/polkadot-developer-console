// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ParaSetupContextInterface, SetupStep } from './types';

export const defaultParaSetupContext: ParaSetupContextInterface = {
  handleConnectTask: (tabId, chainId, endpoint) => Promise.resolve(),
  getActiveStep: (tabId) => 'connect_relay',
  setActiveStep: (tabId, step) => {},
  getSelectedRelayChain: (tabId) => undefined,
  setSelectedRelayChain: (tabId, chainId) => {},
  destroyStateParaSetup: (tabId) => {},
  setupParachainIntegrityCheck: (tabId) => false,
};

export const setupSteps: SetupStep[] = [
  'connect_relay',
  'reserve_para_id',
  'register_parathread',
  'get_coretime',
];
