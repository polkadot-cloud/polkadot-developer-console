// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Entry } from '@polkadot-cloud/react';
import { Header } from 'library/Header';
import { Menu } from 'library/Menu';
import { Tabs } from 'library/Tabs';
import { ChainMenu } from 'library/ChainMenu';
import { Body } from 'library/Body';
import { Default } from 'screens/Default';

export const App = () => (
  // TODO: Get accent theme from active network, if any, otherwise default to `polkadot-relay`.
  <Entry mode="light" theme={`polkadot-relay`}>
    <Menu />
    <Header />
    <Tabs />
    <ChainMenu />
    <Body>
      <Default />
    </Body>
  </Entry>
);
