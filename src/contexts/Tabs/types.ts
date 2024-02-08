// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, SetStateAction } from 'react';

export interface ActiveTab {
  name: string;
}

export type ActiveTabs = Record<string, ActiveTab>;

export interface TabsContextInterface {
  activeTabs: ActiveTabs;
  setActiveTabs: Dispatch<SetStateAction<ActiveTabs>>;
}
