// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FC } from 'react';
import type { PageWidth } from './PageWithMenu/types';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { AnyFunction, AnyJson } from '@w3ux/utils/types';

export type PageSections = Record<
  number,
  {
    label: string;
    icon?: IconProp;
    Component: FC;
    pageWidth?: PageWidth;
  }
>;

export interface RouteSectionProvider {
  label: string;
  sections: PageSections;
  pageWidth: PageWidth;
  integrityCheck?: RouteIntegrityCheckProp;
}

export interface RouteIntegrityCheckProp {
  fn: AnyFunction;
  Context: FC<AnyJson>;
  preloadWidth: PageWidth;
  Preload: FC;
}
