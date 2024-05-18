// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef } from 'react';
import { Wrapper } from './Wrappers';
import { useTooltip } from 'contexts/Tooltip';
import type { TooltipPointerEvent } from 'contexts/Tooltip/types';
import {
  TooltipDelay,
  TooltipInstantThreshold,
} from 'contexts/Tooltip/defaults';
import { motion } from 'framer-motion';
import { getUnixTime } from 'date-fns';

export const Tooltip = () => {
  const {
    openState,
    openStateRef,
    ready,
    setReady,
    delayed,
    delayedRef,
    setDelayed,
    lastCloseRef,
    setLastClose,
    text,
    boundingBox,
    closeTooltip,
    positionRef,
    setPosition,
    calculateTooltipPosition,
  } = useTooltip();

  // Tooltip ref for position access.
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Timeout for delaying showing the tooltip.
  const delayTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Handler for closing the menu on window resize.
  const resizeCallback = () => {
    closeTooltip();
  };

  // Handler for closing the menu on mouse move.
  const mouseMoveCallback = (ev: TooltipPointerEvent) => {
    if (!openStateRef?.current?.open || false) {
      return;
    }

    const mouseX = ev.clientX;
    const mouseY = ev.clientY;

    if (
      mouseX < boundingBox.x ||
      mouseX > boundingBox.x + boundingBox.width ||
      mouseY < boundingBox.y ||
      mouseY > boundingBox.y + boundingBox.height
    ) {
      if (delayedRef?.current === false) {
        setLastClose(getUnixTime(new Date()));
      }

      closeTooltip();
      clearTimeout(delayTimeout.current);
      delayTimeout.current = undefined;
    } else {
      const [newX, newY] = calculateTooltipPosition(
        [mouseX, mouseY],
        tooltipRef
      );
      setPosition([newX, newY]);
      setReady(true);
    }
  };

  // Determine whether the tooltip at the current X position is leaking out of the window.
  const tooltipBoundingRect = tooltipRef.current?.getBoundingClientRect();
  const tooltipWidth = tooltipBoundingRect?.width || 0;
  const tooltipX = tooltipBoundingRect?.x || 0;
  const tooltipMaxX = window.innerWidth - 20;
  const tooltipRightX = tooltipX + tooltipWidth;

  // Don't show tooltip if it's leaking out of the window.
  const showTooltip = ready && !delayed && tooltipRightX <= tooltipMaxX + 1; // NOTE: + 1 is due to a rounding error in Firefox browser.

  // Check position and start tooltip delay timeout when it has been opened. Listen to mouse move
  // events and close the tooltip if the mouse moves outside its bounding box.
  useEffect(() => {
    if (openState.open) {
      const customDelay = openState?.config?.delay;
      let delay = customDelay === undefined ? TooltipDelay : customDelay;

      // If current time is within `TooltipInstantThreshold` of last close, open instantly.
      if (
        getUnixTime(new Date()) - (lastCloseRef?.current || 0) <
        TooltipInstantThreshold
      ) {
        delay = 0;
        setDelayed(false);
      } else {
        delayTimeout.current = setTimeout(() => {
          setDelayed(false);
        }, delay);
      }

      // If an `closeAfterMs` config is provided, close the tooltip after delay + closeAfterMs.
      if (openState?.config?.closeAfterMs) {
        setTimeout(() => {
          closeTooltip();
        }, delay + openState.config.closeAfterMs);
      }

      window.addEventListener('pointermove', mouseMoveCallback);
    } else {
      window.removeEventListener('pointermove', mouseMoveCallback);
    }
    return () => {
      clearTimeout(delayTimeout.current);
      window.removeEventListener('pointermove', mouseMoveCallback);
    };
  }, [openState.open]);

  // Close the tooltip on window resize.
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  return (
    openState.open && (
      <Wrapper
        ref={tooltipRef}
        style={{
          position: 'absolute',
          left: `${positionRef?.current?.[0] || 0}px`,
          top: `${positionRef?.current?.[1] || 0}px`,
          zIndex: 99,
        }}
      >
        <motion.div
          className="inner"
          initial="hidden"
          animate={showTooltip ? 'show' : 'hidden'}
          variants={{
            hidden: {
              opacity: 0,
              transform: 'scale(0.9)',
            },
            show: {
              opacity: 1,
              transform: 'scale(1)',
            },
          }}
          transition={{
            duration: 1,
            ease: [0.1, 1, 0.1, 1],
          }}
        >
          {text}
        </motion.div>
      </Wrapper>
    )
  );
};
