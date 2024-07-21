// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type UniversalProvider from '@walletconnect/universal-provider';
import type { WalletConnectModal } from '@walletconnect/modal';
import type { AnyFunction } from '@w3ux/types';

export interface WalletConnectContextInterface {
  wcProvider: UniversalProvider | null;
  wcModal: WalletConnectModal | null;
  wcMeta: WalletConnectConnectedMeta | null;
}

export interface WalletConnectConnectedMeta {
  uri: string;
  approval: AnyFunction;
}
