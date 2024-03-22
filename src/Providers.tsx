// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { App } from 'App';
import { TabsProvider } from 'contexts/Tabs';
import type { Provider } from 'hooks/withProviders';
import { withProviders } from 'hooks/withProviders';
import { MenuProvider } from 'contexts/Menu';
import { TagsProvider } from 'contexts/Tags';
import { ChainFilterProvider } from 'contexts/ChainFilter';
import { SettingsProvider } from 'contexts/Settings';
import { TooltipProvider } from 'contexts/Tooltip';
import { ApiProvider } from 'contexts/Api';
import { ChainUiProvider } from 'contexts/ChainUi';
import type { ReactNode } from 'react';

export const Providers = () => {
  // !! Provider order matters.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const providers: Provider<{ children: ReactNode }>[] = [
    SettingsProvider,
    TabsProvider,
    TagsProvider,
    ChainFilterProvider,
    MenuProvider,
    TooltipProvider,
    ChainUiProvider,
    ApiProvider,
  ];

  return withProviders(providers, App);
};
