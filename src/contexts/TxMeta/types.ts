// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type BigNumber from 'bignumber.js';
import type { ApiInstanceId } from 'model/Api/types';

export interface TxMetaContextInterface {
  senders: Record<ApiInstanceId, string>;
  getSender: (instanceId: ApiInstanceId) => string | undefined;
  setSender: (instanceId: ApiInstanceId, address: string) => void;
  removeSender: (instanceId: ApiInstanceId) => void;

  getTxFee: (instanceId: ApiInstanceId) => BigNumber;
  setTxFee: (instanceId: ApiInstanceId, fees: BigNumber) => void;
  removeTxFee: (instanceId: ApiInstanceId) => void;
  txFeeValid: (instanceId: ApiInstanceId) => boolean;

  getTxPayload: (instanceId: ApiInstanceId) => AnyJson | undefined;
  getTxPayloadUid: (instanceId: ApiInstanceId) => number;
  setTxPayload: (
    instanceId: ApiInstanceId,
    payload: AnyJson,
    uid: number
  ) => void;
  removeTxPayload: (instanceId: ApiInstanceId) => void;
  incrementTxPayloadUid: (instanceId: ApiInstanceId) => number;

  getTxSignature: (instanceId: ApiInstanceId) => AnyJson | undefined;
  setTxSignature: (instanceId: ApiInstanceId, signature: AnyJson) => void;
  removeTxSignature: (instanceId: ApiInstanceId) => void;

  getPendingNonces: (instanceId: ApiInstanceId) => string[];
  addPendingNonce: (instanceId: ApiInstanceId, nonce: string) => void;
  removePendingNonce: (instanceId: ApiInstanceId, nonce: string) => void;

  destroyInstanceTxMeta: (instanceId: ApiInstanceId) => void;
}

export interface TxPayload {
  payload: AnyJson;
  uid: number;
}
