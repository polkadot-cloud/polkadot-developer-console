// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Route } from 'App';
import type { FC } from 'react';
import type {
  RouteSectionProvider,
  PageSections,
  RouteIntegrityCheckProp,
} from 'routes/Common/types';

export type PageWidth = 'thin' | 'wide';
export interface PageWithMenuProps {
  route: Route;
  Menu: FC<RouteSectionProvider>;
  routeProvider: () => RouteSectionProvider;
}

export interface PageProps {
  sections: PageSections;
  pageWidth: PageWidth;
  integrityCheck?: RouteIntegrityCheckProp;
}
