// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ActiveTabContextInterface } from './types';
import { defaultActiveTabContext } from './defaults';

export const ActiveTabContext = createContext<ActiveTabContextInterface>(
  defaultActiveTabContext
);

export const useActiveTab = () => useContext(ActiveTabContext);

export const ActiveTabProvider = ({ children }: { children: ReactNode }) => {
  const { selectedTabId, getTab } = useTabs();

  // Stores the currently active tab id.
  const [activeTabId, setActiveTabId] = useState<number>(selectedTabId);

  useEffect(() => {
    setActiveTabId(selectedTabId);
  }, [selectedTabId]);

  return (
    <ActiveTabContext.Provider
      value={{
        tabId: activeTabId,
        ownerId: tabIdToOwnerId(activeTabId),
        tab: getTab(activeTabId),
      }}
    >
      {children}
    </ActiveTabContext.Provider>
  );
};
