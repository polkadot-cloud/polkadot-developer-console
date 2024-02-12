// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode, RefObject } from 'react';

export interface MenuContextInterface {
  open: boolean;
  show: boolean;
  items: MenuItem[];
  position: [number, number];
  openMenu: (event: MouseEvent) => void;
  closeMenu: () => void;
  setMenuItems: (items: MenuItem[]) => void;
  checkMenuPosition: (ref: RefObject<HTMLDivElement>) => void;
}

export interface MenuItem {
  icon: ReactNode;
  title: string;
  cb: () => void;
}
