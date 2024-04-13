// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RefObject, MouseEvent as ReactMouseEvent } from 'react';

export interface ConnectContextInterface {
  open: boolean;
  show: boolean;
  hidden: boolean;
  position: [ConnectOverlayPosition, ConnectOverlayPosition];
  dismissOverlay: () => void;
  openConnectOverlay: (ev: ConnectMouseEvent) => void;
  closeConnectOverlay: () => void;
  checkOverlayPosition: (ref: RefObject<HTMLDivElement>) => void;
}

export type ConnectMouseEvent =
  | MouseEvent
  | ReactMouseEvent<HTMLElement, MouseEvent>;

export type ConnectOverlayPosition = string | number;
