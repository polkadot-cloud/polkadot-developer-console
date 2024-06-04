// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef } from 'react';
import { useMenu } from 'contexts/Menu';
import { Wrapper } from './Wrappers';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';
import { motion } from 'framer-motion';
import { TAB_TRANSITION_DURATION_MS } from 'contexts/Tabs/defaults';

export const ContextMenu = () => {
  const {
    open,
    show,
    inner,
    hidden,
    config,
    closeMenu,
    dismissMenu,
    position: [x, y],
    checkMenuPosition,
  } = useMenu();

  // Menu ref for position access.
  const menuRef = useRef(null);

  // Handler for closing the menu on window resize.
  const resizeCallback = () => {
    closeMenu();
  };

  // Close the menu if clicked outside of its container.
  useOutsideAlerter(menuRef, () => {
    dismissMenu();
  });

  // Check position and show the menu if menu has been opened.
  useEffect(() => {
    if (open) {
      checkMenuPosition(menuRef);
    }
  }, [open]);

  // Close the menu on window resize.
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  return (
    open && (
      <Wrapper
        ref={menuRef}
        onAnimationComplete={() => checkMenuPosition(menuRef)}
        className={config.size === 'small' ? 'small' : 'large'}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          opacity: show ? 1 : 0,
          zIndex: 99,
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
          {inner}
        </motion.div>
      </Wrapper>
    )
  );
};
