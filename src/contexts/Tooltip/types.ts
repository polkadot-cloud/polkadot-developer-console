// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';

export interface TooltipContextInterface {
  openState: OpenState;
  openStateRef: RefObject<OpenState> | null;
  ready: boolean;
  readyRef: RefObject<boolean> | null;
  setReady: (ready: boolean) => void;
  delayed: boolean;
  delayedRef: RefObject<boolean> | null;
  setDelayed: (delayed: boolean) => void;
  text: string;
  position: [number, number];
  positionRef: RefObject<[number, number]> | null;
  setPosition: (position: [number, number]) => void;
  lastClose: number;
  setLastClose: (lastClose: number) => void;
  lastCloseRef: RefObject<number> | null;
  boundingBox: BoundingBox;
  closeTooltip: () => void;
  openTooltip: (
    newText: string,
    ref: RefObject<HTMLElement> | null,
    config?: TooltipCustomConfig
  ) => void;
}

export interface BoundingBox {
  width: number;
  height: number;
  x: number;
  y: number;
}
export type TooltipPointerEvent =
  | PointerEvent
  | ReactPointerEvent<HTMLDivElement>;

export interface TooltipCustomConfig {
  delay?: number;
  closeAfterMs?: number;
  disableMove?: boolean;
}

export interface OpenState {
  open: boolean;
  config?: TooltipCustomConfig;
}
