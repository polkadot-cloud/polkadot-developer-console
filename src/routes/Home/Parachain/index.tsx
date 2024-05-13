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

export const Parachain = () => {
  const { setTabActiveTask } = useTabs();
  const { tabId, ownerId } = useActiveTab();
  const { handleConnectApi } = useChainSpaceEnv();
  const { getSelectedRelayChain, setConfirmedRelayChain } = useParaSetup();

  const selectedRelayChain = getSelectedRelayChain(tabId);

  // Get relay chains from the network directory.
  const relayChains = Object.entries(NetworkDirectory).filter(
    ([, chain]) => chain.isRelayChain
  );

  // Handle connect on relay chain selection.
  const handleConnect = async (chainId: ChainId, endpoint: string) => {
    // Store the confirmed relay chain to state.
    setConfirmedRelayChain(tabId, selectedRelayChain);

    // Update tab task.
    setTabActiveTask(tabId, 'parachainSetup');

    // Connect to api instance.
    await handleConnectApi(
      ownerId,
      'parachainSetup:relay',
      selectedRelayChain,
      endpoint
    );
  };

  return (
    <HomePageWrapper>
      <h2>Parachain Setup</h2>
      <h3 className="subtitle">
        Reserve a Para ID and register your parachain.
      </h3>

      <ChainListWrapper>
        <Separator />
        <h4>Start by Choosing Relay Chain:</h4>

        {relayChains.map(([key, { name }]) => (
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
