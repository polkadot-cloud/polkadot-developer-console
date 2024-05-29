// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type BigNumber from 'bignumber.js';
import type { ApiInstanceId } from 'model/Api/types';

export interface TxMetaContextInterface {
  senders: Record<ApiInstanceId, string>;
  getSender: (instanceId: ApiInstanceId) => string | undefined;
  setSender: (address: string, instanceId: ApiInstanceId) => void;
  removeSender: (instanceId: ApiInstanceId) => void;

  getTxFee: (instanceId: ApiInstanceId) => BigNumber;
  setTxFee: (instanceId: ApiInstanceId, fees: BigNumber) => void;
  removeTxFee: (instanceId: ApiInstanceId) => void;
  txFeeValid: (instanceId: ApiInstanceId) => boolean;

  // TODO: Refactor remaining interface to account for multiple api instances.
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
