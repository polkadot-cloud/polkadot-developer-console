// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { App } from 'App';
import { TabsProvider } from 'contexts/Tabs';
import type { Provider } from 'hooks/withProviders';
import { withProviders } from 'hooks/withProviders';
import { MenuProvider } from 'contexts/Menu';
import { TagsProvider } from 'contexts/Tags';
import { ChainSearchProvider } from 'contexts/ChainSearch';

export const Providers = () => {
  // !! Provider order matters.
  const providers: Provider[] = [
    TabsProvider,
    TagsProvider,
    MenuProvider,
    ChainSearchProvider,
  ];

  return withProviders(providers, App);
};
