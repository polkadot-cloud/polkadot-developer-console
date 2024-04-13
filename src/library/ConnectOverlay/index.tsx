// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef } from 'react';
import { Wrapper } from './Wrappers';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { motion } from 'framer-motion';
import { TAB_TRANSITION_DURATION_MS } from 'contexts/Tabs/defaults';
import { useConnect } from 'contexts/Connect';
import { DocumentPadding } from 'contexts/Connect/defaults';

export const ConnectOverlay = () => {
  const {
    open,
    show,
    hidden,
    dismissOverlay,
    position: [x, y],
    closeConnectOverlay,
    checkOverlayPosition,
  } = useConnect();

  // Menu ref for position access.
  const overlayRef = useRef(null);

  // Handler for closing the overlay on window resize.
  const resizeCallback = () => {
    closeConnectOverlay();
  };

  // Close the overlay if clicked outside of its container.
  useOutsideAlerter(overlayRef, () => {
    dismissOverlay();
  });

  // Check position and show the overlay if overlay has been opened.
  useEffect(() => {
    if (open) {
      checkOverlayPosition(overlayRef);
    }
  }, [open]);

  // Close the overlay on window resize.
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  return (
    open && (
      <Wrapper
        ref={overlayRef}
        onAnimationComplete={() => checkOverlayPosition(overlayRef)}
        className="large"
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          opacity: show ? 1 : 0,
          zIndex: 99,
          maxHeight: window.innerHeight - DocumentPadding * 2,
        }}
      >
        <motion.div
          animate={!hidden ? 'show' : 'hidden'}
          variants={{
            hidden: {
              opacity: 0,
              transform: 'scale(0.93)',
            },
            show: {
              opacity: 1,
              transform: 'scale(1)',
            },
          }}
          transition={{
            duration: TAB_TRANSITION_DURATION_MS * 0.001,
            ease: [0.1, 1, 0.1, 1],
          }}
          className="inner"
        >
          <h3>Connect</h3>
        </motion.div>
      </Wrapper>
    )
  );
};
