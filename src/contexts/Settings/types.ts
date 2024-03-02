// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface SettingsContextInterface {
  autoConnect: boolean;
  autoTabNaming: boolean;
  setAutoConnect: (value: boolean) => void;
  setAutoTabNaming: (value: boolean) => void;
}
