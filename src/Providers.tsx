// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
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
import { ActiveTabProvider } from 'contexts/ActiveTab';
import { GlobalChainSpaceProvider } from 'contexts/GlobalChainSpace';
import { ImportedAccountsProvider } from 'contexts/ImportedAccounts';
import { ChainSpaceEnvProvider } from 'contexts/ChainSpaceEnv';
import { ChainExplorerProvider } from 'contexts/ChainExplorer';
import { ApiIndexerProvider } from 'contexts/ApiIndexer';
import { OneShotTooltipProvider } from 'contexts/OneShotTooltip';
import { TxMetaProvider } from 'contexts/TxMeta';

export const Providers = () => {
  // !! --------------------------------
  // !! Provider order matters.
  // !! --------------------------------
  const providers: Provider<AnyJson>[] = [
    // Workspace and tab providers.
    SettingsProvider,
    TabsProvider,
    ActiveTabProvider,
    TagsProvider,
    GlobalChainSpaceProvider,

    // UI providers.
    MenuProvider,
    TooltipProvider,
    OneShotTooltipProvider,
    ConnectProvider,
    ChainUiProvider,

    // Account import related providers.
    ExtensionsProvider,
    [ExtensionAccountsProvider, { dappName: DappName, network: 'polkadot' }], // TODO: Replace hard-coded `network`.
    VaultAccountsProvider,
    ImportedAccountsProvider,

    // Chain space environment and api indexer.
    ApiIndexerProvider,
    ChainSpaceEnvProvider,

    // Account formatting and balances provider.
    AccountsProvider,

    // Transaction providers.
    TxMetaProvider,

    // Task: `chainExplorer` related providers.
    ChainFilterProvider,
    ChainStateProvider,
    ChainExplorerProvider,

    // Task: `parachainSetup` related providers.
    ParaSetupProvider,
  ];

  return withProviders(providers, App);
};
