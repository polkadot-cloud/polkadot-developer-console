// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
    currentPos[0] + tooltipRect.width > bodyRect.width - TooltipDocumentPadding;
  const hiddenBottom =
    currentPos[1] + tooltipRect.height > bodyRect.height + TooltipCursorPadding;
  const x = hiddenRight
    ? bodyRect.width - tooltipRect.width - TooltipDocumentPadding
    : currentPos?.[0] || 0;

  const y = hiddenBottom
    ? bodyRect.height - tooltipRect.height
    : currentPos?.[1] + TooltipCursorPadding || 0;

  return [x, y];
};
