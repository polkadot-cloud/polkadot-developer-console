// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
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
  // Whether tabs are currently hidden.
  const [tabsHidden, setTabsHiddenState] = useState<boolean>(
    local.getSetting('tabsHidden')
  );

  // Whether to Turn on auto connect by default when opening new tabs.
  const [autoConnect, setAutoConnectState] = useState<boolean>(
    local.getSetting('autoConnect', true)
  );

  // Whether to automatically rename tabs based on chain being connected to.
  const [autoTabNaming, setAutoTabNamingState] = useState<boolean>(
    local.getSetting('autoTabNaming', true)
  );

  // Whether to use chain colors.
  const [chainColorEnabled, setChainColorEnabledState] =
    useState<boolean>(true);

  // Set tabs hidden state, to save to local storage.
  const setTabsHidden = (value: boolean) => {
    local.setSetting('tabsHidden', value);
    setTabsHiddenState(value);
  };

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

  // Set chain color enabled state, to save to local storage.
  const setChainColorEnabled = (value: boolean) => {
    local.setSetting('chainColorEnabled', value);
    setChainColorEnabledState(value);
  };

  return (
    <SettingsContext.Provider
      value={{
        tabsHidden,
        setTabsHidden,
        autoConnect,
        setAutoConnect,
        autoTabNaming,
        setAutoTabNaming,
        chainColorEnabled,
        setChainColorEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
