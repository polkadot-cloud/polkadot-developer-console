// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode, RefObject } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { BoundingBox, TooltipContextInterface } from './types';
import {
  TooltipCursorPadding,
  TooltipDocumentPadding,
  defaultBoundingBox,
  defaultTooltipContext,
  defaultTooltipPosition,
} from './defaults';
import { setStateWithRef } from '@w3ux/utils';

export const TooltipContext = createContext<TooltipContextInterface>(
  defaultTooltipContext
);

export const useTooltip = () => useContext(TooltipContext);

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
  // Whether the tooltip is currently open. This initiates tooltip state but does not reflect
  // whether the tooltip is being displayed. NOTE: Needs a ref as it is referenced in event
  // listeners.
  const [open, setOpen] = useState<boolean>(false);
  const openRef = useRef(open);

  // Whether the tooltip is ready to start delay timer and be displayed.
  const [ready, setReady] = useState<boolean>(false);

  // Whether the tooltip's delay timeout has surpassed.
  const [delayed, setDelayed] = useState<boolean>(true);

  // The inner text of the tooltip.
  const [text, setText] = useState<string>('');

  // The tooltip position coordinates. NOTE: Needs a ref as it is referenced in event listeners.
  const [position, setPositionState] = useState<[number, number]>(
    defaultTooltipPosition
  );
  const positionRef = useRef(position);

  // Setter for the tooltip position.
  const setPosition = (newPosition: [number, number]) => {
    setStateWithRef(newPosition, setPositionState, positionRef);
  };

  // The tooltip bounding box to check on mouse move when tooltip is open.
  const [boundingBox, setBoundingBox] =
    useState<BoundingBox>(defaultBoundingBox);

  // Sets the tooltip position and opens it. Only succeeds if the tooltip has been instantiated and
  // is not currently open.
  const openTooltip = (
    newText: string,
    boundBoxRef: RefObject<HTMLElement> | null
  ) => {
    // Set summoning element bounding box.
    setBoundingBox({
      width: boundBoxRef?.current?.offsetWidth || 0,
      height: boundBoxRef?.current?.offsetHeight || 0,
      x: boundBoxRef?.current?.getBoundingClientRect().left || 0,
      y: boundBoxRef?.current?.getBoundingClientRect().top || 0,
    });

    // Set text and mouse position of the tooltip, then open.
    setText(newText);
    setStateWithRef(true, setOpen, openRef);
  };

  // Hides the menu and closes.
  const closeTooltip = () => {
    setReady(false);
    setDelayed(true);
    setBoundingBox(defaultBoundingBox);
    setStateWithRef(false, setOpen, openRef);
    setStateWithRef(defaultTooltipPosition, setPositionState, positionRef);
  };

  // Calculates tooltip x and y, preventing it to be hidden.
  const calculateTooltipPosition = (
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
      currentPos[0] + tooltipRect.width >
      bodyRect.right - TooltipDocumentPadding;
    const hiddenBottom =
      currentPos[1] + tooltipRect.height >
      bodyRect.bottom + TooltipCursorPadding;

    const x = hiddenRight
      ? window.innerWidth - tooltipRect.width - TooltipDocumentPadding
      : currentPos?.[0] || 0;

    const y = hiddenBottom
      ? window.innerHeight - tooltipRect.height
      : currentPos?.[1] + TooltipCursorPadding || 0;

    return [x, y];
  };

  // Adjusts tooltip position and shows the menu.
  return (
    <TooltipContext.Provider
      value={{
        open,
        openRef,
        ready,
        setReady,
        delayed,
        setDelayed,
        text,
        position,
        positionRef,
        setPosition,
        boundingBox,
        closeTooltip,
        openTooltip,
        calculateTooltipPosition,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};
