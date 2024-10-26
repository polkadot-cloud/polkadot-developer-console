// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as defaults from './defaults';
import type { WalletConnectContextInterface } from './types';
import UniversalProvider from '@walletconnect/universal-provider';
import { WalletConnectModal } from '@walletconnect/modal';
import type { AnyFunction, AnyJson } from '@w3ux/types';
import { useChainSpaceEnv } from 'contexts/ChainSpaceEnv';
import { getSdkError } from '@walletconnect/utils';
import { useTabs } from 'contexts/Tabs';
import { getUnixTime } from 'date-fns';
import { isSuperset } from '@w3ux/utils';
import type { ChainId } from 'config/networks/types';

export const WalletConnectContext =
  createContext<WalletConnectContextInterface>(defaults.defaultWalletConnect);

export const useWalletConnect = () => useContext(WalletConnectContext);

// `projectId` is configured on `https://cloud.reown.com/`.
const wcProjectId = 'dcb8a7c6d01ace818286c005f75d70b9';

export const WalletConnectProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { getActiveTaskChainIds } = useTabs();
  const { getConnectedChains, allActiveChainsConnected } = useChainSpaceEnv();

  const allChainsReady = allActiveChainsConnected();
  const connectedChains = getConnectedChains();
  const connectedChainIds = new Set(
    connectedChains.map((chain) => chain.specName)
  );

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

  // Store whether the provider has been wcInitialized.
  const [wcInitialized, setWcInitialized] = useState<boolean>(false);

  // Store whether the wallet connect session is active.
  const [wcSessionActive, setWcSessionActive] = useState<boolean>(false);

  // Store the set of chain ids the most recent session is connected to.
  const sessionChains = useRef<Set<string>>(new Set());

  // Init WalletConnect provider & modal, and update as wcInitialized.
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

    // Subscribe to session delete
    wcProvider.current.on('session_delete', () => {
      disconnectWcSession();
    });

    wcModal.current = modal;
    setWcInitialized(true);
  };

  // Connect WalletConnect provider and retrieve metadata.
  const connectProvider = async () => {
    if (!wcInitialized) {
      return;
    }

    // Disconnect from current session if it exists.
    if (pairingInitiated.current) {
      await disconnectWcSession();
    }

    // Update most recent connected chains.
    sessionChains.current = connectedChainIds;

    const caips = connectedChains.map(
      (chain) => `polkadot:${chain.genesisHash.substring(2).substring(0, 32)}`
    );

    // If there are no chains connected, return early.
    if (!caips.length) {
      return;
    }

    // If an existing session exists, get the topic and add to `connect` to restore it. NOTE:
    // Initialisation has already happened, so we know the provider exists.
    const pairingTopic = wcProvider.current!.session?.pairingTopic;

    const namespaces = {
      polkadot: {
        methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
        chains: caips,
        events: ['chainChanged", "accountsChanged'],
      },
    };
    const connectConfig = {
      optionalNamespaces: namespaces,
    };

    // If no pairing topic or session exists, go ahead and create one, and store meta data for
    // `wcModal` to use.
    let expiry;
    let expired = false;
    if (!pairingTopic) {
      const { uri, approval } =
        await wcProvider.current!.client.connect(connectConfig);
      setWcMeta({ uri, approval });

      // Check session expiry and disconnect from session if expired.
      expiry = wcProvider.current!.session?.expiry;
    }

    // If a session has been connected to, check if it has not expired. If it has, disconnect from
    // the session (user will need to manually connect to a new session in the UI).
    if (expiry) {
      const nowUnix = getUnixTime(new Date());
      if (nowUnix > expiry) {
        disconnectWcSession();
        expired = true;
      }
    }

    // If the session has not expired, flag as an initiated session.
    if (!expired) {
      pairingInitiated.current = true;
      if (pairingTopic) {
        setWcSessionActive(true);
      }
    }
  };

  // Update session namespaces. NOTE: This method is currently not in use due to a
  // default chain error upon reconnecting to the session.
  const updateWcSession = async () => {
    if (!wcInitialized) {
      return;
    }
    // Update most recent connected chains.
    sessionChains.current = connectedChainIds;

    const caips = connectedChains.map(
      (chain) => `polkadot:${chain.genesisHash.substring(2).substring(0, 32)}`
    );

    // If there are no chains connected, return early.
    if (!caips.length) {
      return;
    }
    const topic = wcProvider.current!.session?.topic;
    if (topic) {
      await wcProvider.current!.client.update({
        topic,
        namespaces: {
          polkadot: {
            chains: caips,
            accounts: [],
            methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
            events: ['chainChanged", "accountsChanged'],
          },
        },
      });
    }
  };

  // Initiate a new Wallet Connect session, if not already wcInitialized.
  const initializeWcSession = async () => {
    if (wcInitialized) {
      let wcSession;
      if (wcProvider.current?.session) {
        wcSession = wcProvider.current.session;
      } else {
        wcSession = await initializeNewSession();
      }

      setWcSessionActive(true);
      return wcSession;
    }
    return null;
  };

  // Handle `approval()` by summoning a new modal and initiating a new Wallet Connect session.
  const initializeNewSession = async () => {
    if (!wcInitialized) {
      return;
    }

    // Summon Wallet Connect modal that presents QR Code.
    if (wcMeta?.uri) {
      wcModal.current!.openModal({ uri: wcMeta.uri });
    }

    // Get session from approval.
    const newWcSession = await wcMeta?.approval();

    // Close modal on approval completion.
    wcModal.current!.closeModal();

    // Update session data in provider.
    if (wcProvider.current) {
      wcProvider.current.session = newWcSession;
    }

    return newWcSession;
  };

  // Disconnect from current session.
  const disconnectWcSession = async () => {
    if (!wcProvider.current) {
      return;
    }

    const topic = wcProvider.current.session?.topic;
    if (topic) {
      await wcProvider.current.client.disconnect({
        topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });

      delete wcProvider.current.session;
    }

    pairingInitiated.current = false;
    sessionChains.current = new Set();
    setWcSessionActive(false);
  };

  // Attempt to sign a transaction and receive a signature.
  const signWcTx = async (
    caip: string,
    payload: AnyJson,
    from: string
  ): Promise<string | null> => {
    if (!wcProvider.current || !wcProvider.current.session?.topic) {
      return null;
    }
    const topic = wcProvider.current.session.topic;

    const result: { signature: string } =
      await wcProvider.current.client.request({
        chainId: caip,
        topic,
        request: {
          method: 'polkadot_signTransaction',
          params: {
            address: from,
            transactionPayload: payload,
          },
        },
      });

    return result?.signature || null;
  };

  const fetchAccounts = async (chainid: ChainId): Promise<string[]> => {
    // Retrieve a new session or get current one.
    const wcSession = await initializeWcSession();
    if (wcSession === null) {
      return [];
    }

    // Get accounts from session.
    const walletConnectAccounts = Object.values(wcSession.namespaces)
      .map((namespace: AnyJson) => namespace.accounts)
      .flat();

    // Get the caip of the active chain.
    const caip = connectedChains
      .find((chain) => chain.specName === chainid)
      ?.genesisHash.substring(2)
      .substring(0, 32);

    // Only get accounts for the currently selected `caip`.
    let filteredAccounts = walletConnectAccounts.filter((wcAccount) => {
      const prefix = wcAccount.split(':')[1];
      return prefix === caip;
    });

    // grab account addresses from CAIP account formatted accounts
    filteredAccounts = filteredAccounts.map((wcAccount) => {
      const address = wcAccount.split(':')[2];
      return address;
    });

    return filteredAccounts;
  };

  // On initial render, initiate the WalletConnect provider.
  useEffect(() => {
    if (!wcProvider.current) {
      initProvider();
    }
  }, []);

  // Initially, all active chains (in all tabs) must be connected and ready for the initial provider
  // connection.
  useEffect(() => {
    if (!pairingInitiated.current && wcInitialized && allChainsReady) {
      connectProvider();
    }
  }, [wcInitialized, JSON.stringify(connectedChains), allChainsReady]);

  // Reconnect provider to a new session if a new connected chain is added, or when the provider is
  // set. This can only happen once pairing has been initiated. Doing this will require approval
  // from the user again.
  useEffect(() => {
    const connectedChainsStale = !isSuperset(
      sessionChains.current,
      connectedChainIds
    );
    if (
      pairingInitiated.current &&
      wcInitialized &&
      allChainsReady &&
      connectedChainsStale
    ) {
      connectProvider();
    }
  }, [
    allChainsReady,
    JSON.stringify(connectedChains),
    JSON.stringify(getActiveTaskChainIds()),
  ]);

  return (
    <WalletConnectContext.Provider
      value={{
        connectProvider,
        initializeWcSession,
        updateWcSession,
        disconnectWcSession,
        wcInitialized,
        wcSessionActive,
        fetchAccounts,
        signWcTx,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};
