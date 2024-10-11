// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { App } from 'App';
import { DappName } from 'consts';
import type { AnyJson } from '@w3ux/types';
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
  LedgerAccountsProvider,
  VaultAccountsProvider,
  WCAccountsProvider,
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
import { OverlayProvider } from 'library/Overlay/Provider';
import { PromptProvider } from 'contexts/Prompt';
import { LedgerHardwareProvider } from 'contexts/LedgerHardware';
import { ReserveParaIdProvider } from 'contexts/ParaSetup/ReserveParaId';
import { RegisterParathreadProvider } from 'contexts/ParaSetup/RegisterParathread';
import { InputMetaProvider } from 'contexts/InputMeta';
import { DisconnectTabProvider } from 'contexts/DisconnectTab';
import { WalletConnectProvider } from 'contexts/WalletConnect';

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
    OverlayProvider,
    PromptProvider,
    InputMetaProvider,

    // Transaction providers.
    TxMetaProvider,

    // Chain space environment and api indexer.
    ApiIndexerProvider,
    ChainSpaceEnvProvider,

    // Account import related providers.
    ExtensionsProvider,
    [ExtensionAccountsProvider, { dappName: DappName, network: 'polkadot' }], // TODO: Replace hard-coded `network`.
    WalletConnectProvider,
    WCAccountsProvider,
    VaultAccountsProvider,
    LedgerHardwareProvider,
    LedgerAccountsProvider,
    ImportedAccountsProvider,

    // Account formatting and balances provider.
    AccountsProvider,

    // Task: `chainExplorer` related providers.
    ChainFilterProvider,
    ChainStateProvider,
    ChainExplorerProvider,

    // Task: `parachainSetup` related providers.
    ReserveParaIdProvider,
    RegisterParathreadProvider,
    ParaSetupProvider,

    // Tab disconnect and destroy provider.
    DisconnectTabProvider,
  ];

  return withProviders(providers, App);
};
