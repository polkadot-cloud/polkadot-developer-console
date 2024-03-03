// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';

export interface TooltipContextInterface {
  open: boolean;
  openRef: RefObject<boolean> | null;
  ready: boolean;
  setReady: (ready: boolean) => void;
  delayed: boolean;
  setDelayed: (delayed: boolean) => void;
  text: string;
  position: [number, number];
  positionRef: RefObject<[number, number]> | null;
  setPosition: (position: [number, number]) => void;
  boundingBox: BoundingBox;
  closeTooltip: () => void;
  openTooltip: (
    ev: TooltipPointerEvent,
    newText: string,
    ref: RefObject<HTMLElement> | null
  ) => void;
  calculateTooltipPosition: (
    currentPos: [number, number],
    tooltipRef: RefObject<HTMLDivElement>
  ) => [number, number];
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
