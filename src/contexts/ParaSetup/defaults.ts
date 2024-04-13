// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ParaSetupContextInterface, SetupStep } from './types';

export const defaultParaSetupContext: ParaSetupContextInterface = {
  getActiveStep: (tabId: number) => 'reserve_para_id',
  setActiveStep: (tabId: number, step: SetupStep) => {},
};
