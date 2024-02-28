// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import { useMenu } from 'contexts/Menu';
import { Wrapper } from './Wrappers';
import { useOutsideAlerter } from 'hooks/useOutsideAlerter';

export const ContextMenu = () => {
  const {
    open,
    show,
    inner,
    closeMenu,
    position: [x, y],
    checkMenuPosition,
  } = useMenu();

  // Menu ref for position access.
  const menuRef = useRef(null);

  // Store whether the menu is hidden.
  const [hidden, setHidden] = useState<boolean>(false);

  // Handler for closing the menu on window resize.
  const resizeCallback = () => {
    closeMenu();
  };

  // Duration of transition.
  const TRANSITION_DURATION_MS = 180;

  // Close the menu if clicked outside of its container.
  useOutsideAlerter(menuRef, () => {
    setHidden(true);
    setTimeout(() => {
      closeMenu();
      setHidden(false);
    }, TRANSITION_DURATION_MS);
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
        animate={!hidden ? 'show' : 'hidden'}
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
          duration: TRANSITION_DURATION_MS * 0.001,
          ease: [0.1, 1, 0.1, 1],
        }}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          zIndex: 999,
          opacity: show ? 1 : 0,
        }}
      >
        {inner}
      </Wrapper>
    )
  );
};
