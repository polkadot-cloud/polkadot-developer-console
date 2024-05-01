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
  const tab = getTab(selectedTabId);
  const ownerId = tabIdToOwnerId(selectedTabId);

  // Stores the currently active tab id.
  const [activeTabId, setActiveTabId] = useState<number>(selectedTabId);

  useEffect(() => {
    setActiveTabId(selectedTabId);
  }, [selectedTabId]);

  return (
    <ActiveTabContext.Provider
      value={{
        tabId: activeTabId,
        ownerId,
        apiInstanceId: `${ownerId}_${0}`, // NOTE: A tab's instance index is always 0; there is no ned to fetch it from tab metadata.
        tab,
      }}
    >
      {children}
    </ActiveTabContext.Provider>
  );
};
