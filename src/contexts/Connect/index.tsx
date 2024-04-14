// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { defaultConnectContext, defaultOverlayPosition } from './defaults';
import type { ConnectContextInterface, ConnectOverlayPosition } from './types';
import { TAB_TRANSITION_DURATION_MS } from 'contexts/Tabs/defaults';

export const ConnectContext = createContext<ConnectContextInterface>(
  defaultConnectContext
);

export const useConnect = () => useContext(ConnectContext);

export const ConnectProvider = ({ children }: { children: ReactNode }) => {
  // Whether the overlay is currently open. This initiates context state but does not
  // reflect whether the overlay is being displayed.
  const [open, setOpen] = useState<boolean>(false);

  // Whether the overlay is currently showing.
  const [show, setShow] = useState<boolean>(false);

  // Store whether the overlay is hidden. Used when closing the overlay.
  const [hidden, setHidden] = useState<boolean>(false);

  // The overlay position coordinates.
  // TODO: These should probably be hard-coded to the top right of the screen.
  const [position, setPosition] = useState<
    [ConnectOverlayPosition, ConnectOverlayPosition]
  >([0, 0]);

  // Overlay ref for position access.
  const overlayRef = useRef<HTMLDivElement>(null);

  // Re-syncs the connect overlay position to the default co-ordinates, ensuring it stays at the top
  // right of the window. Can be used with window resizing or on open.
  const syncPosition = () => {
    const bodyRect = document.body.getBoundingClientRect();

    // NOTE: Position is currently hard-coded. Could change if a drag functionality is introduced.
    const x =
      bodyRect.width -
      defaultOverlayPosition.right -
      (overlayRef.current?.clientWidth || 0);

    const y = defaultOverlayPosition.right;
    setPosition([x, y]);
  };

  // Sets the overlay position and opens it. Only succeeds if the overlay has been instantiated and
  // is not currently open.
  const openConnectOverlay = () => {
    if (open) {
      return;
    }
    syncPosition();
    setOpen(true);
  };

  // Dismiss the overlay. This should be called when the overlay is closed. Calls `closeOverlay`
  // once transition is complete.
  const dismissOverlay = () => {
    setHidden(true);
    setTimeout(() => {
      closeConnectOverlay();
      setHidden(false);
    }, TAB_TRANSITION_DURATION_MS);
  };

  // Closes the overlay.
  const closeConnectOverlay = () => {
    setShow(false);
    setOpen(false);
  };

  // Adjusts overlay position and shows the menu.
  const checkOverlayPosition = () => {
    if (!overlayRef?.current) {
      return;
    }

    // Adjust overlay position if it is leaking out of the window, otherwise keep it at the current
    // position.
    const bodyRect = document.body.getBoundingClientRect();
    const menuRect = overlayRef.current.getBoundingClientRect();
    const hiddenRight = menuRect.right > bodyRect.right;
    const hiddenBottom = menuRect.bottom > bodyRect.bottom;

    const x = hiddenRight ? window.innerWidth - menuRect.width : position[0];
    const y = hiddenBottom ? window.innerHeight - menuRect.height : position[1];

    setPosition([x, y]);
    setShow(true);
  };

  return (
    <ConnectContext.Provider
      value={{
        open,
        show,
        hidden,
        position,
        overlayRef,
        syncPosition,
        dismissOverlay,
        closeConnectOverlay,
        openConnectOverlay,
        checkOverlayPosition,
      }}
    >
      {children}
    </ConnectContext.Provider>
  );
};
