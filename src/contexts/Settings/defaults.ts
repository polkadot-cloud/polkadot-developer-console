// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { SettingsContextInterface } from './types';

export const defaultSettingsContext: SettingsContextInterface = {
  tabsHidden: false,
  setTabsHidden: (hidden) => {},
  autoConnect: true,
  autoTabNaming: true,
  chainColorEnabled: true,
  setAutoConnect: (value) => {},
  setAutoTabNaming: (value) => {},
  setChainColorEnabled: (value) => {},
};
