// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ReactNode, RefObject } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type { OneShotTooltipContextInterface, OneShotTooltips } from './types';
import { defaultOneShotTooltipContext } from './defaults';

export const OneShotTooltipContext =
  createContext<OneShotTooltipContextInterface>(defaultOneShotTooltipContext);

export const useOneShotTooltip = () => useContext(OneShotTooltipContext);

export const OneShotTooltipProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Store whether tooltips are open, and their text content, keyed by incremented id.
  const [tooltips, setTooltipsState] = useState<OneShotTooltips>({});
  const tooltipsRef = useRef(tooltips);

  // Setter for tooltips.
  const setTooltips = (newTooltips: OneShotTooltips) => {
    tooltipsRef.current = newTooltips;
    setTooltipsState(newTooltips);
  };

  // Open a tooltip.
  const openTooltip = (text: string, elRef: RefObject<HTMLElement | null>) => {
    const elId = elRef?.current?.id;

    // If ref already exists with the supplied element id, close that first.
    const existingElement = Object.entries(tooltipsRef.current).find(
      ([, tooltip]) => tooltip.elId === elId
    );
    if (existingElement) {
      closeTooltip(Number(existingElement[0]));
    }

    let x = 0;
    let y = 0;
    const rect = elRef?.current?.getBoundingClientRect();
    if (rect) {
      x = rect.left + window.scrollX;
      y = rect.top + window.scrollY;
    }

    // Increment the tooltip id.
    const id = getNextIndex();
    setTooltips({
      ...tooltipsRef.current,
      [id]: {
        elId,
        open: true,
        text,
        ready: false,
        position: [x, y],
      },
    });
  };

  // Set a tooltip to be ready (able to show).
  const setTooltipReadyWithPosition = (
    id: number,
    position: [number, number]
  ) => {
    setTooltips({
      ...tooltipsRef.current,
      [id]: {
        ...tooltipsRef.current[id],
        ready: true,
        position,
      },
    });
  };

  // Set tooltip not ready for closure.
  const dismissTooltip = (id: number) => {
    setTooltips({
      ...tooltipsRef.current,
      [id]: {
        ...tooltipsRef.current[id],
        ready: false,
      },
    });
  };

  // Close a tooltip.
  const closeTooltip = (id: number) => {
    // Remove tooltip entry.
    const newTooltips = Object.fromEntries(
      Object.entries({ ...tooltipsRef.current }).filter(
        ([key]) => Number(key) !== id
      )
    );
    setTooltips(newTooltips);
  };

  // Get the next tooltip index.
  const getNextIndex = () => {
    let instanceIndex = 0;

    if (Object.keys(tooltips).length > 0) {
      // If tooltips already exist, get largest index and increment it.
      instanceIndex =
        Object.keys(tooltips).reduce(
          (acc, id) => Math.max(acc, parseInt(id, acc)),
          0
        ) + 1;
    }

    return instanceIndex;
  };

  return (
    <OneShotTooltipContext.Provider
      value={{
        tooltips,
        openTooltip,
        setTooltipReadyWithPosition,
        dismissTooltip,
        closeTooltip,
      }}
    >
      {children}
    </OneShotTooltipContext.Provider>
  );
};
