// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PageId } from 'App';
import type { ReactNode } from 'react';

export interface SectionContextInterface {
  activeSection: number;
  setActiveSection: (section: number, persist?: boolean) => void;
}

export interface SectionContextProps {
  pageId: PageId;
  children: ReactNode;
}
