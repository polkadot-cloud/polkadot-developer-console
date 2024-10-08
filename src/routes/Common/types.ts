// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { FC } from 'react';
import type { PageWidth } from './PageWithMenu/types';
import type { AnyFunction, AnyJson } from '@w3ux/types';
import type { IconProps } from '@polkadot-cloud/icons';

export type PageSections = Record<
  number,
  {
    label: string;
    icon?: FC<IconProps>;
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
