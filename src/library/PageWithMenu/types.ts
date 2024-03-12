// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Route } from 'App';
import type { FC } from 'react';

export interface PageWithMenuProps {
  route: Route;
  Page: FC;
  Menu: FC;
}
