// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Route } from 'App';
import type { FC } from 'react';
import type { RouteSectionProvider, PageSections } from 'routes/types';

export interface PageWithMenuProps {
  route: Route;
  Page: FC<PageProps>;
  Menu: FC<RouteSectionProvider>;
  routeProvider: () => RouteSectionProvider;
}

export interface PageProps {
  sections: PageSections;
}
