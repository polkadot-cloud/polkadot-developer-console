// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HashRouter } from 'react-router-dom';
import { Entry } from 'library/Entry';
import { Router } from 'Router';

// The currently supported pages.
export type PageId = 'default' | 'settings';

export const App = () => (
  // TODO: Get accent theme from active network, if any, otherwise default to a new
  // `developer-console` accent.
  <Entry mode="light" theme={`polkadot-relay`}>
    <HashRouter basename="/">
      <Router />
    </HashRouter>
  </Entry>
);

export default App;
