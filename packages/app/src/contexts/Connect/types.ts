// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { RefObject, MouseEvent as ReactMouseEvent } from 'react';

export interface ConnectContextInterface {
  open: boolean;
  show: boolean;
  hidden: boolean;
  overlayRef: RefObject<HTMLDivElement>;
  position: [ConnectOverlayPosition, ConnectOverlayPosition];
  syncPosition: () => void;
  dismissOverlay: () => void;
  openConnectOverlay: (ev: ConnectMouseEvent) => void;
  closeConnectOverlay: () => void;
  checkOverlayPosition: () => void;
}

export type ConnectMouseEvent =
  | MouseEvent
  | ReactMouseEvent<HTMLElement, MouseEvent>;

export type ConnectOverlayPosition = string | number;
