// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type UniversalProvider from '@walletconnect/universal-provider';
import type { WalletConnectModal } from '@walletconnect/modal';
import type { AnyFunction } from '@w3ux/types';
import type { Dispatch, SetStateAction } from 'react';

export interface WalletConnectContextInterface {
  wcInitialised: boolean;
  wcProvider: UniversalProvider | null;
  wcModal: WalletConnectModal | null;
  handleNewSession: () => Promise<AnyFunction>;
  disconnectSession: () => Promise<void>;
  wcSessionActive: boolean;
  setWcSessionActive: Dispatch<SetStateAction<boolean>>;
}

export interface WalletConnectConnectedMeta {
  uri: string | undefined;
  approval: AnyFunction;
}
