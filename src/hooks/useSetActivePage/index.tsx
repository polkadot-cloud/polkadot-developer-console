// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveTab } from 'contexts/ActiveTab';
import { useTabs } from 'contexts/Tabs';
import { useLocation } from 'react-router-dom';
import * as local from 'contexts/Tabs/Local';
import type { Route } from 'App';
import { useEffect } from 'react';

export const useSetActivePage = () => {
  const { pathname } = useLocation();
  const { tab, tabId } = useActiveTab();
  const { setTabActivePage, getTabActiveTask } = useTabs();

  const tabActiveTask = getTabActiveTask(tabId);

  // Upon an activeTask change, check if a local active page exists for that route, and
  // move to it if so.
  const onTaskUpdated = () => {
    const activePage = local.getActivePage(tabId, 'default');
    if (tab && activePage !== undefined && activePage !== tab.activePage) {
      setTabActivePage(tabId, 'default', activePage, true);
    }
  };

  // Redirect to local default page on disconnect if activeTask is no longer assigned.
  const onTaskRemoved = () => {
    const localActivePage = local.getActivePage(tabId, 'default');
    setTabActivePage(tabId, 'default', localActivePage || 0);
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
    const activePage = local.getActivePage(tabId, route);

    // Apply the route's local active page if it exists.
    if (activePage !== undefined) {
      setTabActivePage(tabId, route, activePage, true);
    }
  }, [pathname]);

  return null;
};
