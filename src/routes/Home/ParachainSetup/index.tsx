// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import { useEffect, useRef, useState } from 'react';
import type { APIStatusEventDetail, ApiStatus } from 'model/Api/types';
import { isCustomEvent } from 'Utils';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { AccountBalances } from 'model/AccountBalances';
import { useEventListener } from 'usehooks-ts';
import type { ChainId } from 'config/networks';
import { useMenu } from 'contexts/Menu';
import { Form } from './Form';
import { useImportedAccounts } from 'contexts/ImportedAccounts';
import { useActiveBalances } from 'hooks/useActiveBalances';

export const ParachainSetup = () => {
  const { getRelayApi, registerRelayApi, getRelayInstanceIndex } =
    useParaSetup();
  const { closeMenu } = useMenu();
  const { tabId } = useActiveTab();
  const { getAccounts } = useImportedAccounts();

  // The currently selected relay chain to register a ParaID on.
  const [relayChain, setRelayChain] = useState<ChainId>('polkadot');

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
  const chainSpec = relayInstance?.chainSpec;

  // Get available imported accounts.
  const accounts =
    chainSpec && chainSpec.chain
      ? getAccounts(chainSpec.chain, chainSpec.ss58Prefix)
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

  // Handle a chain disconnect.
  const handleDisconnect = () => {
    // Update API status to `disconnected`.
    setRelayApiStatus('disconnected');
  };

  // TODO: Add event listener for when chain spec has been received.

  // Listen for api status updates.
  const documentRef = useRef<Document>(document);
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Update connection status when relay api instance is received.
  useEffect(() => {
    const status = relayInstance?.status || 'disconnected';
    setRelayApiStatus(status as ApiStatus);
  }, [relayInstanceId]);

  return <Form {...stepProps} />;
};
