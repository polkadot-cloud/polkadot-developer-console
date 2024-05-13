// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { IntegrityCheckedParachainContext } from 'routes/ParachainSetup/Provider/types';

export interface ParaSetupContextInterface {
  getActiveStep: (tabId: number) => SetupStep;
  setActiveStep: (tabId: number, step: SetupStep) => void;
  getSelectedRelayChain: (tabId: number) => ChainId | undefined;
  setSelectedRelayChain: (tabId: number, chainId: ChainId) => void;
  destroyTabParaSetup: (tabId: number) => void;
  setupParachainIntegrityCheck: (
    tabId: number
  ) => IntegrityCheckedParachainContext | false;
}

export type SetupStep =
  | 'connect_relay'
  | 'reserve_para_id'
  | 'configure_node'
  | 'register_parathread'
  | 'get_coretime';

export type SetupStepsState = Record<number, SetupStep>;

export type SelectedRelayChains = Record<number, ChainId>;
