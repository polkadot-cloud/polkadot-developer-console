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

export const Router = () => {
  const { getApiStatus } = useApi();
  const { setTabActivePage } = useTabs();
  const { ownerId, tab, tabId } = useActiveTab();

  const apiStatus = getApiStatus(ownerId);

  // Non disconnected API statuses.
  const ACTIVE_API_STATUSES = ['ready', 'connected', 'connecting'];

  // If the active tab is auto connect, & there is a `chain` property to connect to, also go to the
  // Chain tab. Also go to the Chain tab if the API is in a non error / disconnected state.
  const chainPageByDefault =
    (tab?.autoConnect && tab?.chain && !tab.forceDisconnect) ||
    ACTIVE_API_STATUSES.includes(apiStatus);

  //  Redirect to section 0 if api is no longer connected. Do not persist - user might want to land
  //  on this section again on subsequent visits. Forces redirect on tab change if that tab was on a
  //  different section.
  useEffect(() => {
    if (!ACTIVE_API_STATUSES.includes(apiStatus)) {
      setTabActivePage(tabId, 'default', 0, false);
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
