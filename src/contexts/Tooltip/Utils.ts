// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RefObject } from 'react';
import { TooltipCursorPadding, TooltipDocumentPadding } from './defaults';

// Calculates tooltip x and y, preventing it to be hidden.
export const calculateTooltipPosition = (
  currentPos: [number, number],
  ref: RefObject<HTMLDivElement>
): [number, number] => {
  if (!ref?.current) {
    return [0, 0];
  }

  // Adjust position if it is leaking out of the window, otherwise keep it at the current
  // position.
  const bodyRect = document.body.getBoundingClientRect();
  const tooltipRect = ref.current.getBoundingClientRect();

  const hiddenRight =
    currentPos[0] + tooltipRect.width > bodyRect.right - TooltipDocumentPadding;
  const hiddenBottom =
    currentPos[1] + tooltipRect.height > bodyRect.bottom + TooltipCursorPadding;

  const x = hiddenRight
    ? window.innerWidth - tooltipRect.width - TooltipDocumentPadding
    : currentPos?.[0] || 0;

  const y = hiddenBottom
    ? window.innerHeight - tooltipRect.height
    : currentPos?.[1] + TooltipCursorPadding || 0;

  return [x, y];
};
