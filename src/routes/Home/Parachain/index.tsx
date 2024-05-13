// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId, DirectoryId } from 'config/networks';
import { NetworkDirectory } from 'config/networks';
import { HomePageWrapper } from 'routes/Home/Wrappers';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import { useTabs } from 'contexts/Tabs';
import { ChainListWrapper, Separator } from '../Connect/Wrappers';
import { ChainItem } from './ChainItem';
import * as local from 'contexts/Tabs/Local';
import { useSettings } from 'contexts/Settings';

export const Parachain = () => {
  const { autoTabNaming } = useSettings();
  const { tabId, ownerId } = useActiveTab();
  const { handleConnectApi } = useChainSpaceEnv();
  const { setSelectedRelayChain } = useParaSetup();
  const { setTabActiveTask, renameTab, getAutoTabName } = useTabs();

  // Get relay chains from the network directory.
  const relayChains = Object.entries(NetworkDirectory).filter(
    ([, chain]) => chain.isRelayChain
  );

  // Handle connect on relay chain selection.
  const handleConnect = async (chainId: ChainId, endpoint: string) => {
    // Reset local active page on connect.
    local.setActivePage(tabId, 'default', 0);

    // Store the selected relay chain to state.
    setSelectedRelayChain(tabId, chainId);

    // Update tab task.
    setTabActiveTask(tabId, 'parachainSetup');

    // Rename tab if auto tab naming is enabled.
    if (autoTabNaming) {
      renameTab(tabId, getAutoTabName(tabId, 'Parachain Setup'));
    }

    // Connect to api instance.
    await handleConnectApi(ownerId, 'parachainSetup:relay', chainId, endpoint);
  };

  const mainChains = relayChains.filter(([key]) =>
    ['polkadot', 'kusama'].includes(key)
  );

  const testChains = relayChains.filter(([key]) =>
    ['westend', 'rococo'].includes(key)
  );

  return (
    <HomePageWrapper>
      <h2>Parachain Setup</h2>
      <h3 className="subtitle">
        Select a Relay Chain to reserve a Para ID and register as a parathread.
      </h3>

      <ChainListWrapper>
        <Separator />

        <h4>Main Networks</h4>

        {mainChains.map(([key, { name }]) => (
          <ChainItem
            onSelect={handleConnect}
            key={`chain_index_${key}`}
            chainId={key as DirectoryId}
            name={name}
          />
        ))}

        <h4>Test Networks</h4>

        {testChains.map(([key, { name }]) => (
          <ChainItem
            onSelect={handleConnect}
            key={`chain_index_${key}`}
            chainId={key as DirectoryId}
            name={name}
          />
        ))}
      </ChainListWrapper>
    </HomePageWrapper>
  );
};
