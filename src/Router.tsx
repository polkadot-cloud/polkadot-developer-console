// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Navigate, Route, Routes } from 'react-router-dom';
import { Settings } from 'routes/Settings';
import { Header } from 'library/Header';
import { ContextMenu } from 'library/ContextMenu';
import { Tabs } from 'library/Tabs';
import { Tooltip } from 'library/Tooltip';
import { Notifications } from 'library/Notifications';
import { Offline } from 'library/Offline';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { Chain } from 'routes/Chain';
import { Default } from 'routes/SearchChain';

export const Router = () => {
  const { getApiStatus } = useApi();
  const { activeTabId, getActiveTab } = useTabs();
  const apiStatus = getApiStatus(activeTabId);
  const activeTab = getActiveTab();

  // Non disconnected API statuses.
  const ACTIVE_API_STATUSES = ['ready', 'connected', 'connecting'];

  // If the active tab is auto connect, & there is a `chain` property to connect to, also go to the
  // Chain tab. Also go to the Chain tab if the API is in a non error / disconnected state.
  const chainPageByDefault =
    (activeTab?.autoConnect === true && activeTab?.chain) ||
    ACTIVE_API_STATUSES.includes(apiStatus);

  return (
    <>
      <ContextMenu />
      <Notifications />
      <Tooltip />
      <Header />
      <Tabs />
      <Routes>
        <Route
          key={`route_default`}
          path={'/'}
          element={chainPageByDefault ? <Chain /> : <Default />}
        />
        <Route
          key={`route_settings`}
          path={'/settings'}
          element={<Settings />}
        />
        {/* Fallback route to chain */}
        <Route key="route_fallback" path="*" element={<Navigate to="/" />} />
      </Routes>
      <Offline />
    </>
  );
};
