// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef } from 'react';
import { Wrapper } from './Wrappers';
import { useTooltip } from 'contexts/Tooltip';
import type { TooltipMouseEvent } from 'contexts/Tooltip/types';
import { TooltipDelay } from 'contexts/Tooltip/defaults';
import { motion } from 'framer-motion';

export const Tooltip = () => {
  const {
    open,
    openRef,
    ready,
    setReady,
    delayed,
    setDelayed,
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
  let delayTimeout: ReturnType<typeof setTimeout>;

  // Handler for closing the menu on window resize.
  const resizeCallback = () => {
    closeTooltip();
  };

  // Handler for closing the menu on mouse move.
  const mouseMoveCallback = (ev: TooltipMouseEvent) => {
    if (!openRef?.current || false) {
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
      closeTooltip();
      clearTimeout(delayTimeout);
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
  const showTooltip = ready && !delayed && tooltipRightX <= tooltipMaxX;

  // Check position and start tooltip delay timeout when it has been opened. Listen to mouse move
  // events and close the tooltip if the mouse moves outside its bounding box.
  useEffect(() => {
    if (open) {
      delayTimeout = setTimeout(() => {
        setDelayed(false);
      }, TooltipDelay);

      window.addEventListener('pointermove', mouseMoveCallback);
    } else {
      window.removeEventListener('pointermove', mouseMoveCallback);
    }
    return () => {
      clearTimeout(delayTimeout);
      window.removeEventListener('pointermove', mouseMoveCallback);
    };
  }, [open]);

  // Close the tooltip on window resize.
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  return (
    open && (
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
