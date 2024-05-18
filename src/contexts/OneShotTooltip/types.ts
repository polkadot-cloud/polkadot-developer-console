// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RefObject } from 'react';

export interface OneShotTooltipContextInterface {
  tooltips: OneShotTooltips;
  openTooltip: (
    text: string,
    elementRef: RefObject<HTMLElement | null>
  ) => void;
  setTooltipReadyWithPosition: (id: number, position: [number, number]) => void;
  dismissTooltip: (id: number) => void;
  closeTooltip: (id: number) => void;
}

export type OneShotTooltips = Record<number, OneShotTooltip>;

export interface OneShotTooltip {
  elId?: string;
  open: boolean;
  text: string;
  ready: boolean;
  position: [number, number];
}
