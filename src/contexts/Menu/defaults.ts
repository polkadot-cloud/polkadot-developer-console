// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { MenuContextInterface, MenuConfig } from './types';

// Default menu options.
export const defaultMenuConfig: MenuConfig = {
  size: 'small',
};

export const defaultMenuContext: MenuContextInterface = {
  open: false,
  show: false,
  hidden: false,
  dismissMenu: () => {},
  inner: null,
  position: [0, 0],
  config: defaultMenuConfig,
  openMenu: (ev, newInner) => {},
  closeMenu: () => {},
  setMenuInner: (newInner) => {},
  checkMenuPosition: (menuRef) => {},
};

// Duration of entrance and exit transitions.
export const TRANSITION_DURATION_MS = 180;
