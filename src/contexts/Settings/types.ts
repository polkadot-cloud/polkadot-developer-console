// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface SettingsContextInterface {
  tabsHidden: boolean;
  setTabsHidden: (hidden: boolean) => void;
  autoConnect: boolean;
  autoTabNaming: boolean;
  chainColorEnabled: boolean;
  setAutoConnect: (value: boolean) => void;
  setAutoTabNaming: (value: boolean) => void;
  setChainColorEnabled: (value: boolean) => void;
}

export interface LocalSettings {
  tabsHidden?: boolean;
  autoConnect?: boolean;
  autoTabNaming?: boolean;
  chainColorEnabled?: boolean;
}

export type SettingsKey = keyof LocalSettings;
