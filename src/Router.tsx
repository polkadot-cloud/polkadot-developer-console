// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultRoute } from 'routes/Default/Route';
import { SettingsRoute } from 'routes/Settings/Route';
import { Header } from 'library/Header';
import { ContextMenu } from 'library/ContextMenu';
import { Tabs } from 'library/Tabs';
import { Tooltip } from 'library/Tooltip';
import { Notifications } from 'library/Notifications';
import { Offline } from 'library/Offline';

export const Router = () => (
  <>
    <ContextMenu />
    <Notifications />
    <Tooltip />
    <Header />
    <Tabs />
    <Routes>
      <Route key={`route_default`} path={'/'} element={<DefaultRoute />} />
      <Route
        key={`route_settings`}
        path={'/settings'}
        element={<SettingsRoute />}
      />
      {/* Fallback route to chain */}
      <Route key="route_fallback" path="*" element={<Navigate to="/" />} />
    </Routes>
    <Offline />
  </>
);
