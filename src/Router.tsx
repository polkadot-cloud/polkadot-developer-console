// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Navigate, Route, Routes } from 'react-router-dom';
import { Settings } from 'routes/Settings';
import { useApi } from 'contexts/Api';
import { Chain } from 'routes/Chain';
import { Default } from 'routes/Home';
import { useActiveTab } from 'contexts/ActiveTab';
import { useEffect } from 'react';
import { useTabs } from 'contexts/Tabs';
import * as local from 'contexts/Tabs/Local';
import { ACTIVE_API_STATUSES } from 'contexts/Api/defaults';

export const Router = () => {
  const { getApiStatus } = useApi();
  const { setTabActivePage } = useTabs();
  const { tab, tabId, apiInstanceId } = useActiveTab();
  const apiStatus = getApiStatus(apiInstanceId);

  // If the active tab is auto connect, & there is a `chain` property to connect to, also go to the
  // Chain tab. Also go to the Chain tab if the API is in a non error / disconnected state.
  const chainPageByDefault =
    (tab?.autoConnect && tab?.chain && !tab.forceDisconnect) ||
    ACTIVE_API_STATUSES.includes(apiStatus);

  // Upon a chain connection, move to a locally persisted activePage if it is different from the tab's current activePage.
  const setActivePageOnConnect = () => {
    const activePage = local.getActivePage('default', tabId, true);
    if (tab && activePage !== undefined && activePage !== tab.activePage) {
      setTabActivePage(tabId, 'default', activePage, true, true);
    }
  };

  // Redirect to local active page on disconnect if api is no longer connected.
  const setActivePageOnDisconnect = () => {
    const localActivePage = local.getActivePage('default', tabId, false);
    setTabActivePage(tabId, 'default', localActivePage || 0, false);
  };

  // Handle active page changes on tab and api status changes.
  useEffect(() => {
    if (!apiStatus || !ACTIVE_API_STATUSES.includes(apiStatus)) {
      setActivePageOnDisconnect();
    } else {
      setActivePageOnConnect();
    }
  }, [apiStatus, tabId]);

  return (
    <Routes>
      <Route
        key={`route_default`}
        path={'/'}
        element={chainPageByDefault ? <Chain /> : <Default />}
      />
      <Route key={`route_settings`} path={'/settings'} element={<Settings />} />
      {/* Fallback route to chain */}
      <Route key="route_fallback" path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
