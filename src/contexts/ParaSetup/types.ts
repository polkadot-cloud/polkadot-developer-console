// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { Api } from 'model/Api';

export interface ParaSetupContextInterface {
  getActiveStep: (tabId: number) => SetupStep;
  setActiveStep: (tabId: number, step: SetupStep) => void;
  registerRelayApi: (
    tabId: number,
    chainId: ChainId,
    endpoint: string
  ) => Promise<void>;
  getRelayApi: (tabId: number) => Api | undefined;
}

export type SetupStep =
  | 'reserve_para_id'
  | 'configure_node'
  | 'register_parathread'
  | 'get_coretime';
