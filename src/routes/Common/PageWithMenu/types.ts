// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { Route } from 'App';
import type { FC } from 'react';
import type { RouteSectionProvider, PageSections } from 'routes/Common/types';

export type PageWidth = 'thin' | 'wide';
export interface PageWithMenuProps {
  route: Route;
  Menu: FC<RouteSectionProvider>;
  routeProvider: () => RouteSectionProvider;
}

export interface PageProps {
  sections: PageSections;
  pageWidth: PageWidth;
  integrityCheck?: {
    fn: (tabId: number) => AnyJson;
    Context: FC<AnyJson>;
    Preload: FC;
  };
}
