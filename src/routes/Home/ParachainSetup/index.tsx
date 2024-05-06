// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import { useEffect, useRef, useState } from 'react';
import type {
  APIChainSpec,
  APIStatusEventDetail,
  ApiStatus,
} from 'model/Api/types';
import { isCustomEvent } from 'Utils';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { AccountBalances } from 'model/AccountBalances';
import { useEventListener } from 'usehooks-ts';
import type { ChainId } from 'config/networks';
import { useMenu } from 'contexts/Menu';
import { Form } from './Form';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useActiveBalances } from 'hooks/useActiveBalances';
import { setStateWithRef } from '@w3ux/utils';

export const ParachainSetup = () => {
  const { getRelayApi, registerRelayApi, getRelayInstanceIndex } =
    useParaSetup();
  const { closeMenu } = useMenu();
  const { tabId } = useActiveTab();
  const { getAccounts } = useImportedAccounts();

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

  // Props to pass to step components.
  const stepProps = {
    activeBalances,
    relayChain,
    relayInstance,
    relayInstanceIndex,
    setRelayChain,
    relayApiStatus,
    handleConnectApi,
  };

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

  return <Form {...stepProps} />;
};
