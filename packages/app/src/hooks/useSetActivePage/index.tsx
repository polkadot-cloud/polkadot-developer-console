// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { useActiveTab } from 'contexts/ActiveTab';
import { useTabs } from 'contexts/Tabs';
import { useLocation } from 'react-router-dom';
import * as localTabs from 'contexts/Tabs/Local';
import { removeLocalChainUi } from 'contexts/ChainUi/Local';
import type { Route } from 'App';
import { useEffect } from 'react';
import { tabIdToOwnerId } from 'contexts/Tabs/Utils';
import { removeLocalChainState } from 'contexts/ChainState/Local';

export const useSetActivePage = () => {
  const { pathname } = useLocation();
  const { tab, tabId } = useActiveTab();
  const { setTabActivePage, getTabActiveTask } = useTabs();

  const tabActiveTask = getTabActiveTask(tabId);

  // Upon an activeTask change, check if a local active page exists for that route, and
  // move to it if so.
  const onTaskUpdated = () => {
    const activePage = localTabs.getActivePage(tabId, 'default');
    if (tab && activePage !== undefined && activePage !== tab.activePage) {
      setTabActivePage(tabId, 'default', activePage, true);
    }
  };

  // Redirect to local default page on disconnect if activeTask is no longer assigned. This callback
  // also removes stale local storage data associated with the task that has just been removed.
  const onTaskRemoved = () => {
    // Remove stale local storage data.
    removeLocalChainUi(tabId);
    removeLocalChainState(tabIdToOwnerId(tabId));

    // Set correct active page.
    const activePage = localTabs.getActivePage(tabId, 'default');
    if (activePage !== undefined) {
      setTabActivePage(tabId, 'default', activePage, true);
    }
  };

  // Handle active page changes on tab and `activeTask` changes.
  useEffect(() => {
    if (tabActiveTask === null) {
      onTaskRemoved();
    } else {
      onTaskUpdated();
    }
  }, [tabId, tabActiveTask]);

  // Handle location changes to update the active page.
  useEffect(() => {
    // Remove the leading slash from pathname to obtain the route. Falls back to the 'default' route
    // if location is an empty string.
    const route = (pathname.slice(1) || 'default') as Route;
    const activePage = localTabs.getActivePage(tabId, route);

    // Apply the route's local active page if it exists.
    if (activePage !== undefined) {
      setTabActivePage(tabId, route, activePage, true);
    }
  }, [pathname]);

  return null;
};
