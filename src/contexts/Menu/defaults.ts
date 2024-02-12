// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { MenuContextInterface } from './types';

export const defaultMenuContext: MenuContextInterface = {
  open: false,
  show: false,
  items: [],
  position: [0, 0],
  openMenu: (event) => {},
  closeMenu: () => {},
  setMenuItems: (items) => {},
  checkMenuPosition: (menuRef) => {},
};
