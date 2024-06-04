// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DirectoryId } from 'config/networks/types';
import { NetworkDirectory } from 'config/networks';
import { HomePageWrapper } from 'routes/Home/Wrappers';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import { ChainListWrapper, Separator } from '../Connect/Wrappers';
import { ChainItem } from './ChainItem';

export const Parachain = () => {
  const { tabId } = useActiveTab();
  const { handleConnectTask } = useParaSetup();

  // Get relay chains from the network directory.
  const relayChains = Object.entries(NetworkDirectory).filter(
    ([, chain]) => chain?.isRelayChain
  );

  // Handle connect on relay chain selection.
  const handleConnect = async (chainId: DirectoryId, endpoint: string) => {
    handleConnectTask(tabId, chainId, endpoint);
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
