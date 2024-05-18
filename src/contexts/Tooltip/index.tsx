// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode, RefObject } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type {
  BoundingBox,
  OpenState,
  TooltipContextInterface,
  TooltipCustomConfig,
} from './types';
import {
  defaultBoundingBox,
  defaultOpenState,
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
  const [openState, setOpenState] = useState<OpenState>(defaultOpenState);
  const openStateRef = useRef(openState);

  // Whether the tooltip is ready to start delay timer and be displayed. NOTE: Needs a ref as it is
  // referenced in event listeners.
  const [ready, setReadyState] = useState<boolean>(false);
  const readyRef = useRef(ready);

  // Whether the tooltip's delay timeout has surpassed. NOTE: Needs a ref as it is referenced in
  // event listeners.
  const [delayed, setDelayedState] = useState<boolean>(true);
  const delayedRef = useRef(delayed);

  // The inner text of the tooltip.
  const [text, setText] = useState<string>('');

  // The tooltip position coordinates. NOTE: Needs a ref as it is referenced in event listeners.
  const [position, setPositionState] = useState<[number, number]>(
    defaultTooltipPosition
  );
  const positionRef = useRef(position);

  // Persist the last time the tooltip was closed. NOTE: Needs a ref as it is referenced in event
  // listeners.
  const [lastClose, setLastCosedState] = useState<number>(0);
  const lastCloseRef = useRef(lastClose);

  // Setter for ready state.
  const setReady = (newReady: boolean) => {
    setStateWithRef(newReady, setReadyState, readyRef);
  };

  // Setter for tooltip delayed status.
  const setDelayed = (newDelayed: boolean) => {
    setStateWithRef(newDelayed, setDelayedState, delayedRef);
  };

  // Setter for tooltip last closed.
  const setLastClose = (newTime: number) => {
    setStateWithRef(newTime, setLastCosedState, lastCloseRef);
  };

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
    boundBoxRef: RefObject<HTMLElement> | null,
    config?: TooltipCustomConfig
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
    setStateWithRef({ open: true, config }, setOpenState, openStateRef);
  };

  // Hides the menu and closes.
  const closeTooltip = () => {
    setReady(false);
    setDelayed(true);
    setBoundingBox(defaultBoundingBox);
    setStateWithRef({ open: false }, setOpenState, openStateRef);
    setStateWithRef(defaultTooltipPosition, setPositionState, positionRef);
  };

  return (
    <TooltipContext.Provider
      value={{
        openState,
        openStateRef,
        ready,
        readyRef,
        setReady,
        delayed,
        delayedRef,
        setDelayed,
        text,
        position,
        positionRef,
        setPosition,
        lastClose,
        lastCloseRef,
        setLastClose,
        boundingBox,
        closeTooltip,
        openTooltip,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};
