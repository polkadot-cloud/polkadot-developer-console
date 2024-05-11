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
import { TabAccountsProvider } from 'contexts/TabAccounts';
import {
  ExtensionAccountsProvider,
  ExtensionsProvider,
  VaultAccountsProvider,
} from '@w3ux/react-connect-kit';
import { ChainStateProvider } from 'contexts/ChainState';
import { ActiveTabProvider } from 'contexts/ActiveTab';
import { GlobalChainSpaceProvider } from 'contexts/GlobalChainSpace';
import { ImportedAccountsProvider } from 'contexts/ImportedAccounts';
import { ChainSpaceEnvProvider } from 'contexts/ChainSpaceEnv';
import { ChainBrowserProvider } from 'contexts/ChainBrowser';

export const Providers = () => {
  // !! Provider order matters.
  const providers: Provider<AnyJson>[] = [
    SettingsProvider,
    TabsProvider,
    ActiveTabProvider,
    TagsProvider,
    GlobalChainSpaceProvider,
    ChainBrowserProvider,
    ParaSetupProvider,
    ChainFilterProvider,
    MenuProvider,
    TooltipProvider,
    ChainUiProvider,
    ApiProvider,
    ExtensionsProvider,
    [ExtensionAccountsProvider, { dappName: DappName, network: 'polkadot' }], // TODO: Replace hard-coded `network`.
    VaultAccountsProvider,
    ImportedAccountsProvider,
    ChainSpaceEnvProvider,
    TabAccountsProvider,
    ConnectProvider,
    ChainStateProvider,
  ];

  return withProviders(providers, App);
};
