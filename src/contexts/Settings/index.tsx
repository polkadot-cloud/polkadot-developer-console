// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { defaultSettingsContext } from './defaults';
import type { SettingsContextInterface } from './types';
import * as local from './Local';

export const SettingsContext = createContext<SettingsContextInterface>(
  defaultSettingsContext
);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  // Whether to Turn on auto connect by default when opening new tabs.
  const [autoConnect, setAutoConnectState] = useState<boolean>(
    local.getSetting('autoConnect')
  );

  // Whether to automatically rename tabs based on chain being connected to.
  const [autoTabNaming, setAutoTabNamingState] = useState<boolean>(
    local.getSetting('autoTabNaming')
  );

  // Set auto connect state, to save to local storage.
  const setAutoConnect = (value: boolean) => {
    local.setSetting('autoConnect', value);
    setAutoConnectState(value);
  };

  // Set auto tab naming state, to save to local storage.
  const setAutoTabNaming = (value: boolean) => {
    local.setSetting('autoTabNaming', value);
    setAutoTabNamingState(value);
  };

  return (
    <SettingsContext.Provider
      value={{ autoConnect, setAutoConnect, autoTabNaming, setAutoTabNaming }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
