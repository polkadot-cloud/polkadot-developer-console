// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as defaults from './defaults';
import type { WalletConnectContextInterface } from './types';
import UniversalProvider from '@walletconnect/universal-provider';
import { WalletConnectModal } from '@walletconnect/modal';
import type { AnyFunction } from '@w3ux/types';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { getSdkError } from '@walletconnect/utils';

export const WalletConnectContext =
  createContext<WalletConnectContextInterface>(defaults.defaultWalletConnect);

export const useWalletConnect = () => useContext(WalletConnectContext);

// ProjectId configured on `https://cloud.walletconnect.com/`.
const wcProjectId = 'dcb8a7c6d01ace818286c005f75d70b9';

export const WalletConnectProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { getConnectedChains, allActiveChainsConnected } = useChainSpaceEnv();

  const allChainsReady = allActiveChainsConnected();
  const connectedChains = getConnectedChains();

  // The WalletConnect provider.
  const wcProvider = useRef<UniversalProvider | null>(null);

  // The WalletConnect modal handler.
  const wcModal = useRef<WalletConnectModal | null>(null);

  // Track whether pairing has been initiated.
  const pairingInitiated = useRef<boolean>(false);

  // Connect metadata for the WalletConnect provider.
  const [wcMeta, setWcMeta] = useState<{
    uri: string | undefined;
    approval: AnyFunction;
  } | null>(null);

  // Store whether the provider has been initialised.
  const [initialised, setInitialised] = useState<boolean>(false);

  // Store whether the wallet connect session is active.
  const [wcSessionActive, setWcSessionActive] = useState<boolean>(false);

  // Init WalletConnect provider & modal, and update as initialised.
  const initProvider = async () => {
    const provider = await UniversalProvider.init({
      projectId: wcProjectId,
      metadata: {
        name: 'Polkadot Developer Console',
        description: 'A next-generation Polkadot Developer Console',
        url: 'https://console.polkadot.cloud/',
        icons: ['https://console.polkadot.cloud/img/wc-icon.png'],
      },
      relayUrl: 'wss://relay.walletconnect.com',
    });

    const modal = new WalletConnectModal({
      projectId: wcProjectId,
    });

    wcProvider.current = provider;
    wcModal.current = modal;

    setInitialised(true);
  };

  // Connect WalletConnect provider and retrieve metadata.
  const connectProvider = async () => {
    if (!wcProvider.current || !wcModal.current) {
      return;
    }

    // Disconnect from current session if it exists.
    if (pairingInitiated.current) {
      await disconnectSession();
    }

    const caips = connectedChains.map(
      (chain) => `polkadot:${chain.genesisHash.substring(2).substring(0, 32)}`
    );

    // If there are no chains connected, return early.
    if (!caips.length) {
      return;
    }

    // If an existing session exists, get the topic and add to `connect` to restore it.
    const pairingTopic = wcProvider.current.session?.pairingTopic;
    const connectConfig = {
      requiredNamespaces: {
        polkadot: {
          methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
          chains: caips,
          events: ['chainChanged", "accountsChanged'],
        },
      },
      pairingTopic,
      skipPairing: !!pairingTopic,
    };

    const { uri, approval } =
      await wcProvider.current.client.connect(connectConfig);

    pairingInitiated.current = true;
    setWcMeta({ uri, approval });
    if (pairingTopic) {
      setWcSessionActive(true);
    }
  };

  // Handle `approval()` by summoning a new modal and initiating a new Wallet Connect session.
  const handleNewSession = async () => {
    if (!wcMeta || !wcModal.current || !initialised) {
      return;
    }
    // Summon Wallet Connect modal that presents QR Code.
    if (wcMeta.uri) {
      wcModal.current.openModal({ uri: wcMeta.uri });
    }

    // Get session from approval.
    const newWcSession = await wcMeta?.approval();

    // Update session data in provider.
    if (wcProvider.current) {
      wcProvider.current.session = newWcSession;
    }

    setWcSessionActive(true);
    return newWcSession;
  };

  // Disconnect from current session.
  const disconnectSession = async () => {
    if (!wcProvider.current) {
      return;
    }

    const topic = wcProvider.current.session?.topic;
    if (topic) {
      await wcProvider.current.client.disconnect({
        topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
    }

    pairingInitiated.current = false;
    setWcSessionActive(false);
    setWcMeta(null);
  };

  // On initial render, initiate the WalletConnect provider.
  useEffect(() => {
    if (!wcProvider.current) {
      initProvider();
    }
  }, []);

  // Reconnect WalletConnect provider if connected chains change / disconnect, or when the provider
  // is set. Initially, all active chains (in all tabs) must be connected and ready.
  useEffect(() => {
    if (initialised && allChainsReady) {
      console.log('ok to connect provider now');
      connectProvider();
    }
  }, [initialised, JSON.stringify(connectedChains), allChainsReady]);

  return (
    <WalletConnectContext.Provider
      value={{
        wcInitialised: initialised,
        wcProvider: wcProvider.current,
        wcModal: wcModal.current,
        handleNewSession,
        disconnectSession,
        wcSessionActive,
        setWcSessionActive,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};
