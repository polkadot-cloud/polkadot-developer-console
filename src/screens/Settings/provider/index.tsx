// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { defaultActiveSection, defaultSettingsContext } from './defaults';
import type { SettingsContextInterface } from './types';

export const SettingsContext = createContext<SettingsContextInterface>(
  defaultSettingsContext
);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [activeSection, setActiveSection] =
    useState<number>(defaultActiveSection);

  return (
    <SettingsContext.Provider
      value={{
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
