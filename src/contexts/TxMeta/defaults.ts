// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import BigNumber from 'bignumber.js';
import type { TxMetaContextInterface } from './types';

export const defaultTxMeta: TxMetaContextInterface = {
  senders: {},
  getSender: (instanceId) => undefined,
  setSender: (sender, instanceId) => {},
  removeSender: (instanceId) => {},

  // TODO: Refactor remaining interface to account for multiple api instances.
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
