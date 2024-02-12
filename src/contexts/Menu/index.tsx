// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode, RefObject } from 'react';
import { createContext, useContext, useState } from 'react';
import { defaultMenuContext } from './defaults';
import type { MenuContextInterface, MenuItem } from './types';

export const MenuContext =
  createContext<MenuContextInterface>(defaultMenuContext);

export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  // Whether the menu is currently open. This initiates menu state but does not reflect whether the
  // menu is being displayed.
  const [open, setOpen] = useState<boolean>(false);

  // Whether the menu is currently showing.
  const [show, setShow] = useState<boolean>(false);

  // The items to display in the menu.
  const [items, setItems] = useState<MenuItem[]>([]);

  // The menu position coordinates.
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  // Padding from the window edge.
  const DocumentPadding = 20;

  // Hides the menu and closes.
  const closeMenu = () => {
    setShow(false);
    setOpen(false);
  };

  // Sets the menu position and opens it. Only succeeds if the menu has been instantiated and is not
  // currently open.
  const openMenu = (event: MouseEvent) => {
    if (open) {
      return;
    }
    const bodyRect = document.body.getBoundingClientRect();
    const x = event.clientX - bodyRect.left;
    const y = event.clientY - bodyRect.top;

    setPosition([x, y]);
    setOpen(true);
  };

  // Sets the items of the menu.
  const setMenuItems = (newItems: MenuItem[]) => {
    setItems(newItems);
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
    const hiddenRight = menuRect.right > bodyRect.right;
    const hiddenBottom = menuRect.bottom > bodyRect.bottom;

    const x = hiddenRight
      ? window.innerWidth - menuRect.width - DocumentPadding
      : position[0];

    const y = hiddenBottom
      ? window.innerHeight - menuRect.height - DocumentPadding
      : position[1];

    setPosition([x, y]);
    setShow(true);
  };

  return (
    <MenuContext.Provider
      value={{
        open,
        show,
        items,
        position,
        closeMenu,
        setMenuItems,
        openMenu,
        checkMenuPosition,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
