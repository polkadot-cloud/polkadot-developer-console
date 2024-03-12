// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Route } from 'App';
import type { ReactNode } from 'react';

export interface RouteContextInterface {
  activePage: number;
  setActivePage: (section: number, persist?: boolean) => void;
}

export interface RouteContextProps {
  route: Route;
  children: ReactNode;
}
