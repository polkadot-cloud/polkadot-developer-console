// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import type { APIStatusEventDetail, ApiStatus } from 'model/Api/types';
import { Form } from './Form';
import { isCustomEvent } from 'Utils';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { AccountBalances } from 'model/AccountBalances';
import { useEventListener } from 'usehooks-ts';

export const ReserveParaId = () => {
  const { tabId } = useActiveTab();
  const { registerRelayApi, getRelayApi, getRelayInstanceIndex } =
    useParaSetup();

  // The currently selected relay chain to register a ParaID on.
  const [relayChain, setRelayChain] = useState<string>('Polkadot Relay Chain');

  // The API status of the relay chain.
  const [relayApiStatus, setRelayApiStatus] =
    useState<ApiStatus>('disconnected');

  // Handle registering a relay chain api instance.
  const handleConnectApi = async () => {
    // TODO: Replace hard-coded values.
    await registerRelayApi(tabId, 'polkadot', 'wss://rpc.ibp.network/polkadot');
  };

  const relayInstance = getRelayApi(tabId);
  const relayInstanceId = relayInstance?.instanceId;
  const relayInstanceIndex = getRelayInstanceIndex(tabId);

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

  const documentRef = useRef<Document>(document);

  // Listen for api status updates.
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Update connection status when relay api instance is received.
  useEffect(() => {
    const status = relayInstance?.status || 'disconnected';
    setRelayApiStatus(status as ApiStatus);
  }, [relayInstanceId]);

  return (
    <Form
      relayChain={relayChain}
      setRelayChain={setRelayChain}
      relayApiStatus={relayApiStatus}
      handleConnectApi={handleConnectApi}
      relayInstanceIndex={relayInstanceIndex}
    />
  );
};
