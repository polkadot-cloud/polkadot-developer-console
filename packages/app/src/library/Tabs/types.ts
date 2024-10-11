// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
