// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface SettingsContextInterface {
  autoConnect: boolean;
  autoTabNaming: boolean;
  chainColorEnabled: boolean;
  setAutoConnect: (value: boolean) => void;
  setAutoTabNaming: (value: boolean) => void;
  setChainColorEnabled: (value: boolean) => void;
}

export interface LocalSettings {
  autoConnect?: boolean;
  autoTabNaming?: boolean;
  chainColorEnabled?: boolean;
}

export type SettingsKey = keyof LocalSettings;
