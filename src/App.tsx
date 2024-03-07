// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HashRouter } from 'react-router-dom';
import { Entry } from 'library/Entry';
import { Router } from 'Router';
import { ErrorBoundary } from 'react-error-boundary';
import { AppErrorBoundary } from 'library/ErrorBoundaries/AppErrorBoundary';
import * as integrityChecks from 'IntegrityChecks';

// The currently supported pages.
export type PageId = 'default' | 'settings';

export const App = () => (
  <Entry mode="light" accent={`developer-console`}>
    <HashRouter basename="/">
      <ErrorBoundary
        FallbackComponent={AppErrorBoundary}
        onReset={() => {
          // Check local storage for integrity & upate if necessary.
          integrityChecks.checkLocalTabs();
          integrityChecks.checkLocalTags();
          integrityChecks.checkLocalChainFilter();
        }}
      >
        <Router />
      </ErrorBoundary>
    </HashRouter>
  </Entry>
);

export default App;
