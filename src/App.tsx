// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Entry } from '@polkadot-cloud/react';
import { Header } from 'library/Header';
import { ContextMenu } from 'library/ContextMenu';
import { Tabs } from 'library/Tabs';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Default } from 'screens/Default';
import { Settings } from 'screens/Settings';
import { ChainMenu } from 'screens/Default/ChainMenu';
import { pageWithMenu } from 'screens/Utils';
import { SettingsMenu } from 'screens/Settings/SettingsMenu';

const AppInner = () => (
  // TODO: Get accent theme from active network, if any, otherwise default to `polkadot-relay`.
  <Entry mode="light" theme={`polkadot-relay`}>
    <ContextMenu />
    <Header />
    <Tabs />

    <Routes>
      <Route
        key={`route_chain`}
        path={'/'}
        element={pageWithMenu(<Default />, <ChainMenu />)}
      />
      <Route
        key={`route_settings`}
        path={'/settings'}
        element={pageWithMenu(<Settings />, <SettingsMenu />)}
      />
      {/* Fallback route to chain */}
      <Route
        key="route_default"
        path="*"
        element={<Navigate to="/overview" />}
      />
    </Routes>
  </Entry>
);

export const App = () => (
  <HashRouter basename="/">
    <AppInner />
  </HashRouter>
);
