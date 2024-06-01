// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode, RefObject } from 'react';
import { createContext, useContext, useState } from 'react';
import { defaultMenuContext, defaultMenuConfig } from './defaults';
import type { MenuContextInterface, MenuMouseEvent, MenuConfig } from './types';
import { TAB_TRANSITION_DURATION_MS } from 'contexts/Tabs/defaults';

export const MenuContext =
  createContext<MenuContextInterface>(defaultMenuContext);

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  // Whether the menu is currently open. This initiates menu state but does not reflect whether the
  // menu is being displayed.
  const [open, setOpen] = useState<boolean>(false);

  // Whether the menu is currently showing.
  const [show, setShow] = useState<boolean>(false);

  // Store whether the menu is hidden. Used when closing the menu.
  const [hidden, setHidden] = useState<boolean>(false);

  // The components to be displayed in the menu.
  const [inner, setInner] = useState<ReactNode>(null);

  // The menu position coordinates.
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  // Set menu options.
  const [config, setConfig] = useState<MenuConfig>(defaultMenuConfig);

  // Padding from the window edge.
  const DocumentPadding = 20;

  // Sets the menu position and opens it. Only succeeds if the menu has been instantiated and is not
  // currently open.
  const openMenu = (
    ev: MenuMouseEvent,
    newInner: ReactNode,
    options: MenuConfig = defaultMenuConfig
  ) => {
    if (open) {
      return;
    }
    const bodyRect = document.body.getBoundingClientRect();
    const x = ev.clientX - bodyRect.left;
    const y = ev.clientY - bodyRect.top;

    if (newInner) {
      setInner(newInner);
    }

    setConfig(options);
    setPosition([x, y]);
    setOpen(true);
  };

  // Dismiss the menu. This should be called when the menu is closed. Calls `closeMenu` once
  // transition is complete.
  const dismissMenu = () => {
    setHidden(true);
    setTimeout(() => {
      closeMenu();
      setHidden(false);
    }, TAB_TRANSITION_DURATION_MS);
  };

  // Closes the menu.
  const closeMenu = () => {
    setShow(false);
    setOpen(false);
  };

  // Sets the inner JSX of the menu.
  const setMenuInner = (newInner: ReactNode) => {
    setInner(newInner);
  };

  // Adjusts menu position and shows the menu.
  const checkMenuPosition = (ref: RefObject<HTMLDivElement>) => {
    if (!ref?.current) {
      return;
    }

    // Adjust menu position if it is leaking out of the window, otherwise keep it at the current
    // position.
    const bodyRect = document.body.getBoundingClientRect();
    const menuRect = ref.current.getBoundingClientRect();
    const hiddenRight = menuRect.right > bodyRect.right - DocumentPadding;
    const hiddenBottom = menuRect.bottom > bodyRect.bottom - DocumentPadding;

    const x = hiddenRight
      ? bodyRect.width - menuRect.width - DocumentPadding
      : position[0];

    const y = hiddenBottom
      ? bodyRect.height - menuRect.height - DocumentPadding
      : position[1];

    setPosition([x, y]);
    setShow(true);
  };

  return (
    <MenuContext.Provider
      value={{
        open,
        show,
        hidden,
        dismissMenu,
        config,
        inner,
        position,
        closeMenu,
        openMenu,
        setMenuInner,
        checkMenuPosition,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
