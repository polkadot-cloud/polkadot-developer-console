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
  const { getConnectedChains } = useChainSpaceEnv();

  const connectedChains = getConnectedChains();

  // The WalletConnect provider.
  const wcProvider = useRef<UniversalProvider | null>(null);

  // The WaleltConnect modal handler.
  const wcModal = useRef<WalletConnectModal | null>(null);

  // Connect metadata for the WalletConnect provider.
  const [wcMeta, setWcMeta] = useState<{
    uri: string;
    approval: AnyFunction;
  } | null>(null);

  // The WalletConnect session.
  const [wcSession] = useState<AnyFunction | null>(null);

  // Store whether the provider has been initialised.
  const [initialised, setInitialised] = useState<boolean>(false);

  // Init WalletConnect provider & modal, and update as initialised.
  const initProvider = async () => {
    const provider = await UniversalProvider.init({
      projectId: wcProjectId,
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

    const caips = connectedChains.map(
      (chain) => `polkadot:${chain.genesisHash.substring(2).substring(0, 32)}`
    );

    // If there are no chains connected, return early.
    if (!caips.length) {
      return;
    }

    const { uri, approval } = await wcProvider.current.client.connect({
      requiredNamespaces: {
        polkadot: {
          methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
          chains: caips,
          events: ['chainChanged", "accountsChanged'],
        },
      },
    });

    const newWcMeta = uri ? { uri, approval } : null;
    setWcMeta(newWcMeta);
  };

  // On initial render, initiate the WalletConnect provider.
  useEffect(() => {
    if (!wcProvider.current) {
      initProvider();
    }
  }, []);

  // Reconnect WalletConnect provider if connected chains change / disconnect, or when the provider
  // is set.
  useEffect(() => {
    if (initialised) {
      connectProvider();
    }
  }, [initialised, JSON.stringify(connectedChains)]);

  return (
    <WalletConnectContext.Provider
      value={{
        wcInitialised: initialised,
        wcProvider: wcProvider.current,
        wcModal: wcModal.current,
        wcMeta,
        wcSession,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};
