// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HashRouter } from 'react-router-dom';
import { Entry } from 'library/Entry';
import { Router } from 'Router';
import { ErrorBoundary } from 'react-error-boundary';
import { AppErrorBoundary } from 'library/ErrorBoundaries/AppErrorBoundary';
import { performLocalIntegrityChecks } from 'IntegrityChecks/Local';
import { ContextMenu } from 'library/ContextMenu';
import { Notifications } from 'library/Notifications';
import { Tooltip } from 'library/Tooltip';
import { Header } from 'library/Header';
import { Tabs } from 'library/Tabs';
import { Offline } from 'library/Offline';
import { RenderedTabProvider } from 'contexts/RenderedTab';

// The currently supported pages.
export type Route = 'default' | 'settings';

export const App = () => (
  <Entry mode="light" accent={`developer-console`}>
    <HashRouter basename="/">
      <ErrorBoundary
        FallbackComponent={AppErrorBoundary}
        onReset={() =>
          // Check local storage for integrity & upate if necessary.
          performLocalIntegrityChecks()
        }
      >
        <ContextMenu />
        <Notifications />
        <Tooltip />
        <Header />
        <Tabs />
        {/* Protect router from re-renders by rederring to `renderedTabId` in the
         * RenderedTabProvider context. Prevents the router re-rendering on tab
         * changes where the previously used tab id is still in use. */}
        <RenderedTabProvider>
          <Router />
        </RenderedTabProvider>
        <Offline />
      </ErrorBoundary>
    </HashRouter>
  </Entry>
);

export default App;
