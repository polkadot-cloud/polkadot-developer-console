// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { SetupStep } from 'contexts/ParaSetup/types';

export interface FooterProps {
  next: SetupStep | null;
  prev: SetupStep | null;
}
