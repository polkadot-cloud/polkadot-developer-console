// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useOneShotTooltip } from 'contexts/OneShotTooltip';
import type { OneShotTooltip } from 'contexts/OneShotTooltip/types';
import { useEffect, useRef } from 'react';
import { Wrapper } from '../Tooltip/Wrappers';
import { motion } from 'framer-motion';
import { calculateTooltipPosition } from 'contexts/Tooltip/Utils';
import { useActiveTab } from 'contexts/ActiveTab';
import { useEffectIgnoreInitial } from '@w3ux/hooks';
import { useLocation } from 'react-router-dom';

export const Tooltip = ({
  id,
  tooltip,
}: {
  id: number;
  tooltip: OneShotTooltip;
}) => {
  const { pathname } = useLocation();
  const { tabId, tab } = useActiveTab();
  const { setTooltipReadyWithPosition, dismissTooltip, closeTooltip } =
    useOneShotTooltip();
  const { open, text, position } = tooltip;

  const TOOLTIP_SHOW_DURATION_MS = 1000;

  const TOOLTIP_FADE_DURATION_MS = 750;

  // Tooltip ref for position access.
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Timeout for closing the tooltip after a delay.
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Timeout for fading the tooltip before closure.
  const fadeTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Show tooltip once it is ready.
  const showTooltip = tooltip.ready;

  // Handle tooltip behaviour
  useEffect(() => {
    if (open) {
      // Fade tooltip after show delay.
      fadeTimeout.current = setTimeout(() => {
        dismissTooltip(id);

        // Close the tooltip after fade.
        closeTimeout.current = setTimeout(() => {
          closeTooltip(id);
        }, TOOLTIP_FADE_DURATION_MS);
      }, TOOLTIP_SHOW_DURATION_MS);
    }

    const [newX, newY] = calculateTooltipPosition(
      [position[0], position[1]],
      tooltipRef
    );

    // Update tooltip's position if needed, and set to ready.
    setTooltipReadyWithPosition(id, [newX, newY]);

    return () => {
      clearTimeout(fadeTimeout.current);
      clearTimeout(closeTimeout.current);
    };
  }, [open]);

  // Handler for closing the tooltip on window resize.
  const resizeCallback = () => {
    closeTooltip(id);
  };

  // Close the tooltip on window resize.
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  // If route, active page, or active tab changes, close the tooltip immediately.
  useEffectIgnoreInitial(() => {
    closeTooltip(id);
    clearTimeout(fadeTimeout.current);
    clearTimeout(closeTimeout.current);
  }, [pathname, tabId, tab?.activePage]);

  return !open ? null : (
    <Wrapper
      ref={tooltipRef}
      style={{
        position: 'absolute',
        left: position[0],
        top: position[1],
        zIndex: 99,
      }}
    >
      <motion.div
        className="inner"
        initial={showTooltip ? 'show' : 'hidden'}
        animate={showTooltip ? 'show' : 'hidden'}
        variants={{
          hidden: {
            opacity: 0,
            transform: 'scale(0.8)',
          },
          show: {
            opacity: 1,
            transform: 'scale(1)',
          },
        }}
        transition={{
          duration: TOOLTIP_FADE_DURATION_MS * 0.001,
          ease: [0.1, 1, 0.1, 1],
        }}
      >
        {text}
      </motion.div>
    </Wrapper>
  );
};
