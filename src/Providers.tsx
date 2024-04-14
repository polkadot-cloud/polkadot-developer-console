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
import { ParaSetupProvider } from 'contexts/ParaSetup';
import { ConnectProvider } from 'contexts/Connect';
import {
  ExtensionAccountsProvider,
  ExtensionsProvider,
} from '@w3ux/react-connect-kit';
import type { AnyJson } from '@w3ux/utils/types';
import { DappName } from 'consts';

export const Providers = () => {
  // !! Provider order matters.
  const providers: Provider<AnyJson>[] = [
    SettingsProvider,
    TabsProvider,
    TagsProvider,
    ParaSetupProvider,
    ChainFilterProvider,
    MenuProvider,
    TooltipProvider,
    ChainUiProvider,
    ApiProvider,
    [
      ExtensionsProvider,
      { options: { chainSafeSnapEnabled: true, polkagateSnapEnabled: true } },
    ],
    [
      ExtensionAccountsProvider,
      { dappName: DappName, network: 'polkadot', ss58: 0 }, // TODO: Replace hard-coded values.
    ],
    ConnectProvider,
  ];

  return withProviders(providers, App);
};
