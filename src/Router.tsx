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
  const { activeTabId } = useTabs();
  const apiStatus = getApiStatus(activeTabId);

  // If `Api` instance is active, render `Overview` component, otherwise render `Connect` component.
  const ACTIVE_API_STATUSES = ['ready', 'connected', 'connecting'];

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
          element={
            ACTIVE_API_STATUSES.includes(apiStatus) ? <Chain /> : <Default />
          }
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
