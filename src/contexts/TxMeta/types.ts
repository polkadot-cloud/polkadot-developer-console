// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import type { AnyJson } from '@w3ux/utils/types';
import type BigNumber from 'bignumber.js';

export interface TxMetaContextInterface {
  // TODO: Refactor interface to account for multiple api instances.
  sender: MaybeAddress;
  setSender: (sender: MaybeAddress) => void;
  txFees: BigNumber;
  txFeesValid: boolean;
  setTxFees: (fees: BigNumber) => void;
  resetTxFees: () => void;
  getPayloadUid: () => number;
  getTxPayload: () => AnyJson;
  setTxPayload: (payload: AnyJson, uid: number) => void;
  incrementPayloadUid: () => number;
  resetTxPayload: () => void;
  getTxSignature: () => AnyJson;
  setTxSignature: (signature: AnyJson) => void;
  pendingNonces: string[];
  addPendingNonce: (nonce: string) => void;
  removePendingNonce: (nonce: string) => void;
}
