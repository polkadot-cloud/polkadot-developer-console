// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { SettingsContextInterface } from './types';

export const defaultSettingsContext: SettingsContextInterface = {
  activePage: 0,
  setActivePage: (page) => {},
  tabsHidden: false,
  setTabsHidden: (hidden) => {},
  autoConnect: true,
  autoTabNaming: true,
  chainColorEnabled: true,
  setAutoConnect: (value) => {},
  setAutoTabNaming: (value) => {},
  setChainColorEnabled: (value) => {},
};
