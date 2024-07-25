// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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

  // The tab meta key can be used to create unique identifiers for form elements. It is unique to
  // the tab, the active task and the active page.
  let metaKey = '';
  if (tab) {
    metaKey = `${selectedTabId}_${tab.activeTask}_${tab.activePage}`;
  }
  return (
    <ActiveTabContext.Provider
      value={{
        tabId: selectedTabId,
        ownerId,
        tab,
        metaKey,
      }}
    >
      {children}
    </ActiveTabContext.Provider>
  );
};
