// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { BoundingBox, OpenState, TooltipContextInterface } from './types';

// Default bounding box of the tooltip. The bounding box is the area of the DOM that the tooltip is
// active in. Any mouse movement outside of this area will close the tooltip.
export const defaultBoundingBox: BoundingBox = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};

// The default tooltip position, off screen.
export const defaultTooltipPosition: [number, number] = [0, -999];

// Delay before showing tooltip.
export const TooltipDelay = 1000;

// Document padding.
export const TooltipDocumentPadding = 20;

// Cursor padding.
export const TooltipCursorPadding = 20;

// Time threshold for instant open after last close in seconds.
export const TooltipInstantThreshold = 1.5;

// Closed by default with no custom config.
export const defaultOpenState: OpenState = {
  open: false,
};

export const defaultTooltipContext: TooltipContextInterface = {
  openState: defaultOpenState,
  openStateRef: null,
  ready: false,
  readyRef: null,
  setReady: (ready) => {},
  delayed: true,
  delayedRef: null,
  setDelayed: (delayed) => {},
  text: '',
  position: defaultTooltipPosition,
  positionRef: null,
  setPosition: (position) => {},
  lastClose: 0,
  lastCloseRef: null,
  setLastClose: (lastClose) => {},
  boundingBox: defaultBoundingBox,
  closeTooltip: () => {},
  openTooltip: (ev, newInner) => {},
};
