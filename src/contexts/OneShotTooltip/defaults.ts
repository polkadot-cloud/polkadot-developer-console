// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { OneShotTooltipContextInterface } from './types';

export const defaultOneShotTooltipContext: OneShotTooltipContextInterface = {
  tooltips: {},
  openTooltip: (text, elementRef) => {},
  setTooltipReadyWithPosition: (id, position) => {},
  dismissTooltip: (id) => {},
  closeTooltip: (id) => {},
};
