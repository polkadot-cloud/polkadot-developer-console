// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type {
  ReactNode,
  RefObject,
  MouseEvent as ReactMouseEvent,
} from 'react';

export interface MenuContextInterface {
  open: boolean;
  show: boolean;
  hidden: boolean;
  dismissMenu: () => void;
  inner: ReactNode | null;
  position: [number, number];
  config: MenuConfig;
  openMenu: (
    ev: MenuMouseEvent,
    newInner: ReactNode,
    options?: MenuConfig
  ) => void;
  closeMenu: () => void;
  setMenuInner: (items: ReactNode) => void;
  checkMenuPosition: (ref: RefObject<HTMLDivElement>) => void;
}
export interface MenuConfig {
  size: 'small' | 'large';
}

export type MenuMouseEvent =
  | MouseEvent
  | ReactMouseEvent<HTMLElement, MouseEvent>;
