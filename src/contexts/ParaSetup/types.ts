// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface ParaSetupContextInterface {
  getActiveStep: (tabId: number) => SetupStep;
  setActiveStep: (tabId: number, step: SetupStep) => void;
}

export type SetupStep =
  | 'reserve_para_id'
  | 'configure_node'
  | 'register_parathread'
  | 'get_coretime';
