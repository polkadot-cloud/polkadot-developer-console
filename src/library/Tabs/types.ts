// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RefObject } from 'react';

export interface TabProps {
  id: number;
  index: number;
  name: string;
  initial?: boolean;
}

export interface ControlsProps {
  tabContainerRef: RefObject<HTMLDivElement>;
}
