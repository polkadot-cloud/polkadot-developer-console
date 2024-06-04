// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ConnectContextInterface } from './types';

export const defaultConnectContext: ConnectContextInterface = {
  open: false,
  show: false,
  hidden: false,
  position: [0, 0],
  overlayRef: { current: null },
  syncPosition: () => {},
  dismissOverlay: () => {},
  openConnectOverlay: (ev) => {},
  closeConnectOverlay: () => {},
  checkOverlayPosition: () => {},
};

// The default position of the connect overlay.
export const defaultOverlayPosition = { top: 0, right: 0 };

// Width of overlay in pixels.
export const CONNECT_OVERLAY_MAX_WIDTH = 500;

// Duration of entrance and exit transitions.
export const TRANSITION_DURATION_MS = 180;

// Padding from the window edge to the overlay.
export const DocumentPadding = 10;
