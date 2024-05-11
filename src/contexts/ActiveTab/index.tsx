// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
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

  return (
    <ActiveTabContext.Provider
      value={{
        tabId: selectedTabId,
        ownerId,
        apiInstanceId: `${ownerId}_0`, // NOTE: A tab's instance index is always 0; there is no ned to fetch it from tab metadata.
        tab,
      }}
    >
      {children}
    </ActiveTabContext.Provider>
  );
};
