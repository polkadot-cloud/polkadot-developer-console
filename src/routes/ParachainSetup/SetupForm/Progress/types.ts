// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';

export interface SectionProps {
  stepId: string;
  label: string;
  collapsedStatus: boolean;
  showStatus: boolean;
  children: ReactNode;
  className?: string;
}
