// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { WalletConnectModal } from '@walletconnect/modal';
import type { AnyFunction, AnyJson } from '@w3ux/types';
import type { Dispatch, SetStateAction } from 'react';

export interface WalletConnectContextInterface {
  wcInitialised: boolean;
  wcModal: WalletConnectModal | null;
  initialiseNewSession: () => Promise<AnyJson>;
  disconnectSession: () => Promise<void>;
  wcSessionActive: boolean;
  setWcSessionActive: Dispatch<SetStateAction<boolean>>;
}

export interface WalletConnectConnectedMeta {
  uri: string | undefined;
  approval: AnyFunction;
}
