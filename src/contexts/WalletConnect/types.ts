// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AnyFunction, AnyJson } from '@w3ux/types';

export interface WalletConnectContextInterface {
  connectProvider: () => Promise<void>;
  wcInitialized: boolean;
  wcSessionActive: boolean;
  initializeWcSession: () => Promise<AnyJson>;
  updateWcSession: () => Promise<void>;
  disconnectWcSession: () => Promise<void>;
}

export interface WalletConnectConnectedMeta {
  uri: string | undefined;
  approval: AnyFunction;
}
