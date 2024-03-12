// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { RouteContextInterface } from './types';

export const defaultActivePage = 0;

export const defaultRouteContext: RouteContextInterface = {
  activePage: defaultActivePage,
  setActivePage: (section, persist) => {},
};
