// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { BoundingBox, TooltipContextInterface } from './types';

export const defaultBoundingBox: BoundingBox = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};

export const defaultTooltipContext: TooltipContextInterface = {
  open: false,
  openRef: null,
  ready: false,
  setReady: (ready) => {},
  delayed: true,
  setDelayed: (delayed) => {},
  text: '',
  position: [0, 0],
  positionRef: null,
  setPosition: (position) => {},
  boundingBox: defaultBoundingBox,
  closeTooltip: () => {},
  openTooltip: (ev, newInner) => {},
  calculateTooltipPosition: (currentPos, tooltipRef) => [0, 0],
};

// Delay before showing tooltip.
export const TooltipDelay = 2000;

// Document padding.
export const TooltipDocumentPadding = 20;

// Cursor padding.
export const TooltipCursorPadding = 20;
