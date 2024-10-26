// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AnyFunction, AnyJson } from '@w3ux/types';
import type { DirectoryId } from 'config/networks/types';

export interface WalletConnectContextInterface {
  connectProvider: () => Promise<void>;
  wcInitialized: boolean;
  wcSessionActive: boolean;
  initializeWcSession: () => Promise<AnyJson>;
  updateWcSession: () => Promise<void>;
  disconnectWcSession: () => Promise<void>;
  fetchAccounts: (directoryId: DirectoryId) => Promise<string[]>;
  signWcTx: (
    caip: string,
    payload: AnyJson,
    from: string
  ) => Promise<string | null>;
}

export interface WalletConnectConnectedMeta {
  uri: string | undefined;
  approval: AnyFunction;
}
