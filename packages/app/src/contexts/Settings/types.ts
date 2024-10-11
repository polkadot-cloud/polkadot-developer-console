// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

export interface SettingsContextInterface {
  activePage: number;
  setActivePage: (page: number) => void;
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
  activePage?: number;
  tabsHidden?: boolean;
  autoConnect?: boolean;
  autoTabNaming?: boolean;
  chainColorEnabled?: boolean;
}

export type SettingsKey = keyof LocalSettings;
