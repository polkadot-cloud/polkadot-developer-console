// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
import { ConnectOverlay } from 'library/ConnectOverlay';
import { StickyOnTop } from 'Wrappers';
import { OneShotTooltips } from 'library/OneShotTooltips';
import { Overlays } from 'overlay';
import { Prompt } from 'library/Prompt';

// The currently supported pages.
export type Route = 'default' | 'settings';

export const App = () => (
  <Entry mode="light" accent="developer-console">
    <HashRouter basename="/">
      <ErrorBoundary
        FallbackComponent={AppErrorBoundary}
        onReset={() =>
          // Check local storage for integrity & upate if necessary.
          performLocalIntegrityChecks()
        }
      >
        <ContextMenu />
        <ConnectOverlay />
        <Notifications />
        <Tooltip />
        <OneShotTooltips />
        <Overlays />
        <Prompt />
        <StickyOnTop>
          <Header />
          <Tabs />
        </StickyOnTop>
        <Router />
        <Offline />
      </ErrorBoundary>
    </HashRouter>
  </Entry>
);

export default App;
