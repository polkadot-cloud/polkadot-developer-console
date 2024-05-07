// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import { isCustomEvent } from 'Utils';
import type { ChainId } from 'config/networks';
import { useActiveTab } from 'contexts/ActiveTab';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useMenu } from 'contexts/Menu';
import { useParaSetup } from 'contexts/ParaSetup';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { useActiveBalances } from 'hooks/useActiveBalances';
import { AccountBalances } from 'model/AccountBalances';
import type {
  APIChainSpec,
  APIStatusEventDetail,
  ApiStatus,
} from 'model/Api/types';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import type { ChainSpaceEnvContextInterface } from './types';
import { defaultChainSpaceEnvContext } from './defaults';

export const ChainSpaceEnv = createContext<ChainSpaceEnvContextInterface>(
  defaultChainSpaceEnvContext
);

export const useChainSpaceEnv = () => useContext(ChainSpaceEnv);

export const ChainSpaceEnvProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { closeMenu } = useMenu();
  const { tabId } = useActiveTab();
  const { getAccounts } = useImportedAccounts();
  const { getRelayApi, registerRelayApi, getRelayInstanceIndex } =
    useParaSetup();

  // The currently selected relay chain to register a ParaID on.
  const [relayChain, setRelayChain] = useState<ChainId>('polkadot');

  // Store chain spec of each api instance. NOTE: requires ref as it is used in event listener.
  const [relayChainSpec, setRelayChainSpecState] = useState<
    APIChainSpec | undefined
  >();
  const relayChainSpecRef = useRef(relayChainSpec);

  // Setter for chain spec. Updates state and ref.
  const setRelayChainSpec = (newChainSpec: APIChainSpec | undefined) => {
    setStateWithRef(newChainSpec, setRelayChainSpecState, relayChainSpecRef);
  };

  // The API status of the relay chain.
  const [relayApiStatus, setRelayApiStatus] =
    useState<ApiStatus>('disconnected');

  // Handle registering a relay chain api instance.
  const handleConnectApi = async (provider: string) => {
    closeMenu();
    setRelayApiStatus('connecting');
    await registerRelayApi(tabId, relayChain, provider);
  };

  // Get relay api instance and its identifiers.
  const relayInstance = getRelayApi(tabId);
  const relayInstanceId = relayInstance?.instanceId;
  const relayInstanceIndex = getRelayInstanceIndex(tabId);

  // Get available imported accounts.
  const accounts =
    relayChainSpec && relayChainSpec.chain
      ? getAccounts(relayChainSpec.chain, relayChainSpec.ss58Prefix)
      : [];

  // Get tab account balances from `useActiveBalances`.
  const activeBalances = useActiveBalances({
    accounts: accounts.map(({ address }) => address),
    apiInstanceId: relayInstanceId,
    apiStatus: relayApiStatus,
    dependencies: [relayInstanceId],
  });

  // Handle incoming api status updates.
  const handleNewApiStatus = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { ownerId, instanceId, chainId, event } =
        e.detail as APIStatusEventDetail;

      // Ensure we are handling the correct api instance here.
      if (ownerId === 'global' && instanceId === relayInstanceId) {
        switch (event) {
          case 'ready':
            setRelayApiStatus('ready');

            // Initialise account balance subscriptions.
            SubscriptionsController.set(
              instanceId,
              'accountBalances',
              new AccountBalances(ownerId, instanceId, chainId)
            );
            break;
          case 'connecting':
            setRelayApiStatus('connecting');
            break;
          case 'connected':
            setRelayApiStatus('connected');
            break;
          case 'disconnected':
            handleDisconnect();
            break;
          case 'error':
            handleDisconnect();
            break;
          case 'destroyed':
            handleDisconnect();
            break;
        }
      }
    }
  };

  // Handle incoming chain spec updates.
  const handleNewChainSpec = (e: Event): void => {
    if (isCustomEvent(e)) {
      const { instanceId, spec, consts } = e.detail;
      if (instanceId === relayInstanceId) {
        setRelayChainSpec({ ...spec, consts });
      }
    }
  };

  // Handle a chain disconnect.
  const handleDisconnect = () => {
    // Update API status to `disconnected`.
    setRelayApiStatus('disconnected');
    setRelayChainSpec(undefined);
  };

  const documentRef = useRef<Document>(document);

  // Listen for api status updates.
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Listen for new chain spec updates.
  useEventListener('new-chain-spec', handleNewChainSpec, documentRef);

  // Update connection status when relay api instance is received.
  useEffect(() => {
    const status = relayInstance?.status || 'disconnected';
    setRelayApiStatus(status as ApiStatus);
  }, [relayInstanceId]);

  return (
    <ChainSpaceEnv.Provider
      value={{
        activeBalances,
        relayChain,
        relayInstance,
        relayInstanceIndex,
        setRelayChain,
        relayApiStatus,
        handleConnectApi,
      }}
    >
      {children}
    </ChainSpaceEnv.Provider>
  );
};
