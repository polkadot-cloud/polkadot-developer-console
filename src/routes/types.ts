// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FC } from 'react';

export type PageSections = Record<
  number,
  {
    label: string;
    Component: FC;
  }
>;

export interface RouteSectionProvider {
  label: string;
  sections: PageSections;
}
