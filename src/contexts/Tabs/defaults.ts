// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { TabsContextInterface } from './types';

export const defaultTabsContext: TabsContextInterface = {
  activeTabs: {},
  setActiveTabs: (activeTabs) => {},
};
