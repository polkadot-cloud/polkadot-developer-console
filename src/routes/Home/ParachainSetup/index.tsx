// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FormWrapper, Wrapper } from './Wrappers';
import { useParaSetup } from 'contexts/ParaSetup';
import { useActiveTab } from 'contexts/ActiveTab';
import { Footer } from './Footer';
import { Progress } from './Progress';
import { ConnectRelay } from './ConnectRelay';
import { useEffect, useRef, useState } from 'react';
import type { APIStatusEventDetail, ApiStatus } from 'model/Api/types';
import { isCustomEvent } from 'Utils';
import { SubscriptionsController } from 'controllers/Subscriptions';
import { AccountBalances } from 'model/AccountBalances';
import { useEventListener } from 'usehooks-ts';

export const ParachainSetup = () => {
  const { tabId } = useActiveTab();
  const {
    getRelayApi,
    getActiveStep,
    registerRelayApi,
    getRelayInstanceIndex,
  } = useParaSetup();

  // Get the active step in the setup process.
  const activeStep = getActiveStep(tabId);

  // The currently selected relay chain to register a ParaID on.
  const [relayChain, setRelayChain] = useState<string>('Polkadot Relay Chain');

  // The API status of the relay chain.
  const [relayApiStatus, setRelayApiStatus] =
    useState<ApiStatus>('disconnected');

  // Handle registering a relay chain api instance.
  const handleConnectApi = async () => {
    setRelayApiStatus('connecting');

    // TODO: Replace hard-coded values.
    await registerRelayApi(tabId, 'polkadot', 'wss://rpc.ibp.network/polkadot');
  };

  const relayInstance = getRelayApi(tabId);
  const relayInstanceId = relayInstance?.instanceId;
  const relayInstanceIndex = getRelayInstanceIndex(tabId);

  const stepProps = {
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

  // Listen for api status updates.
  const documentRef = useRef<Document>(document);
  useEventListener('api-status', handleNewApiStatus, documentRef);

  // Update connection status when relay api instance is received.
  useEffect(() => {
    const status = relayInstance?.status || 'disconnected';
    setRelayApiStatus(status as ApiStatus);
  }, [relayInstanceId]);

  return (
    <Wrapper>
      <h2>Set up a New Parachain</h2>

      <Progress />

      {activeStep === 'connect_relay' && <ConnectRelay {...stepProps} />}

      {activeStep === 'reserve_para_id' && (
        <FormWrapper>
          <h3>
            Reserve a Para ID or choose an existing one from your accounts.
          </h3>
        </FormWrapper>
      )}

      {activeStep === 'configure_node' && (
        <FormWrapper>
          <h3>Configure your Parachain Node to connect to the Relay Chain.</h3>
        </FormWrapper>
      )}

      {activeStep === 'register_parathread' && (
        <FormWrapper>
          <h3>Register your Parathread on the Relay Chain.</h3>
        </FormWrapper>
      )}

      {activeStep === 'get_coretime' && (
        <FormWrapper>
          <h3>
            Get bulk or instantaneous Coretime and start processing blocks.
          </h3>
        </FormWrapper>
      )}

      <Footer />
    </Wrapper>
  );
};
