// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Navigate, Route, Routes } from 'react-router-dom';
import { Settings } from 'routes/Settings';
import { Chain } from 'routes/Chain';
import { Default } from 'routes/Home';
import { useActiveTab } from 'contexts/ActiveTab';
import { useEffect } from 'react';
import { useTabs } from 'contexts/Tabs';
import * as local from 'contexts/Tabs/Local';

export const Router = () => {
  const { tab, tabId } = useActiveTab();
  const { setTabActivePage, getTabActiveTask } = useTabs();
  const tabActiveTask = getTabActiveTask(tabId);

  // Upon an activeTask assignment, move to a locally persisted activePage if it is different from
  // the tab's current activePage.
  const onActiveTaskChanged = () => {
    // TODO: Amend to take into consideration the `activeTask`, rather than `connected`.
    const activePage = local.getActivePage(tabId, 'default', true);
    if (tab && activePage !== undefined && activePage !== tab.activePage) {
      // TODO: Amend to take into consideration the `activeTask`, rather than `apiActive`.
      setTabActivePage(tabId, 'default', activePage, true, true);
    }
  };

  // Redirect to local default page on disconnect if activeTask is no longer assigned.
  const onActiveTaskRemoved = () => {
    const localActivePage = local.getActivePage(tabId, 'default', false);
    setTabActivePage(tabId, 'default', localActivePage || 0, false);
  };

  // Handle active page changes on tab and `activeTask` changes.
  useEffect(() => {
    if (tabActiveTask === null) {
      onActiveTaskRemoved();
    } else {
      onActiveTaskChanged();
    }
  }, [tabId, tabActiveTask]);

  return (
    <Routes>
      <Route
        key={`route_default`}
        path={'/'}
        element={
          tabActiveTask === 'connectChain' && tab?.chain ? (
            <Chain />
          ) : (
            <Default />
          )
        }
      />
      <Route key={`route_settings`} path={'/settings'} element={<Settings />} />
      {/* Fallback route to chain */}
      <Route key="route_fallback" path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
