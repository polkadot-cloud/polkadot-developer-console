// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import BigNumber from 'bignumber.js';
import type { TxMetaContextInterface } from './types';

export const defaultTxMeta: TxMetaContextInterface = {
  // TODO: Refactor interface to account for multiple api instances.
  sender: null,
  setSender: (sender) => {},
  txFees: new BigNumber(0),
  txFeesValid: false,
  setTxFees: (fees) => {},
  resetTxFees: () => {},
  getPayloadUid: () => 0,
  getTxPayload: () => {},
  setTxPayload: (payload, uid) => {},
  incrementPayloadUid: () => 0,
  resetTxPayload: () => {},
  getTxSignature: () => null,
  setTxSignature: (signature) => {},
  pendingNonces: [],
  addPendingNonce: (nonce) => {},
  removePendingNonce: (nonce) => {},
};
