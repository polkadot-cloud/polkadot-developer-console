// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { App } from 'App';
import { DappName } from 'consts';
import type { AnyJson } from '@w3ux/utils/types';
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
import { AccountsProvider } from 'contexts/Accounts';
import {
  ExtensionAccountsProvider,
  ExtensionsProvider,
  VaultAccountsProvider,
} from '@w3ux/react-connect-kit';
import { ChainStateProvider } from 'contexts/ChainState';

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
    ExtensionsProvider,
    [ExtensionAccountsProvider, { dappName: DappName, network: 'polkadot' }], // TODO: Replace hard-coded `network`.
    VaultAccountsProvider,
    AccountsProvider,
    ConnectProvider,
    ChainStateProvider,
  ];

  return withProviders(providers, App);
};
