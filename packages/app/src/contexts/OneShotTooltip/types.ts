// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { RefObject } from 'react';

export interface OneShotTooltipContextInterface {
  tooltips: OneShotTooltips;
  openTooltip: (text: string, elRef: RefObject<HTMLElement | null>) => void;
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
