// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Navigate, Route, Routes } from 'react-router-dom';
import { Settings } from 'routes/Settings';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { Chain } from 'routes/Chain';
import { Default } from 'routes/SearchChain';
import { useActiveTabId } from 'contexts/RenderedTab';

export const Router = () => {
  const { getTab } = useTabs();
  const { getApiStatus } = useApi();
  const activeTabId = useActiveTabId();

  const apiStatus = getApiStatus(activeTabId);
  const activeTab = getTab(activeTabId);

  // Non disconnected API statuses.
  const ACTIVE_API_STATUSES = ['ready', 'connected', 'connecting'];

  // If the active tab is auto connect, & there is a `chain` property to connect to, also go to the
  // Chain tab. Also go to the Chain tab if the API is in a non error / disconnected state.
  const chainPageByDefault =
    (activeTab?.autoConnect &&
      activeTab?.chain &&
      !activeTab.forceDisconnect) ||
    ACTIVE_API_STATUSES.includes(apiStatus);

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
