// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { FC } from 'react';

export type ScreenSections = Record<
  number,
  {
    label: string;
    Component: FC;
  }
>;