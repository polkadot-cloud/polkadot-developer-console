// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as defaults from './defaults';
import type { WalletConnectContextInterface } from './types';
import UniversalProvider from '@walletconnect/universal-provider';
import { WalletConnectModal } from '@walletconnect/modal';
import type { AnyFunction } from '@w3ux/types';

export const WalletConnectContext =
  createContext<WalletConnectContextInterface>(defaults.defaultWalletConnect);

export const useWalletConnect = () => useContext(WalletConnectContext);

// ProjectID configured on `https://cloud.walletconnect.com/`.
const wcProjectId = 'dcb8a7c6d01ace818286c005f75d70b9';

export const WalletConnectProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // The WalletConnect provider.
  const wcProvider = useRef<UniversalProvider | null>(null);

  // The WaleltConnect modal handler.
  const wcModal = useRef<WalletConnectModal | null>(null);

  // Connect metadata for the WalletConnect provider.
  const wcMeta = useRef<{ uri: string; approval: AnyFunction } | null>(null);

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

    const { uri, approval } = await wcProvider.current.client.connect({
      requiredNamespaces: {
        polkadot: {
          methods: ['polkadot_signTransaction', 'polkadot_signMessage'],
          chains: [
            // TODO: Only connect to chains that are being used in tabs.
            'polkadot:91b171bb158e2d3848fa23a9f1c25182', // polkadot Relay chain.
          ],
          events: ['chainChanged", "accountsChanged'],
        },
      },
    });

    if (uri) {
      wcMeta.current = { uri, approval };
    }
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
    // TODO: Handle APIs changing.
    if (initialised /* || apisUpdated*/) {
      connectProvider();
    }
  }, [initialised /*, apisUpdated*/]);

  return (
    <WalletConnectContext.Provider
      value={{
        wcProvider: wcProvider.current,
        wcModal: wcModal.current,
        wcMeta: wcMeta.current,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};
