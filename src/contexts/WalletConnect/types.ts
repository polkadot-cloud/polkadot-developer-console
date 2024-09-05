// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type UniversalProvider from '@walletconnect/universal-provider';
import type { WalletConnectModal } from '@walletconnect/modal';
import type { AnyFunction } from '@w3ux/types';

export interface WalletConnectContextInterface {
  wcInitialised: boolean;
  wcProvider: UniversalProvider | null;
  wcModal: WalletConnectModal | null;
  wcMeta: WalletConnectConnectedMeta | null;
  wcSession: AnyFunction | null;
}

export interface WalletConnectConnectedMeta {
  uri: string;
  approval: AnyFunction;
}
