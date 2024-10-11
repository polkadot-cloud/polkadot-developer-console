// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AnyJson } from '@w3ux/types';
import type { DirectoryId } from 'config/networks/types';

export interface LedgerHardwareContextInterface {
  integrityChecked: boolean;
  setIntegrityChecked: (checked: boolean) => void;
  checkRuntimeVersion: (
    txMetadataChainId: string,
    transactionVersion: string
  ) => Promise<void>;
  transportResponse: AnyJson;
  setStatusCode: (ack: string, statusCode: LedgerStatusCode) => void;
  setIsExecuting: (val: boolean) => void;
  getStatusCode: () => LedgerResponse | null;
  resetStatusCode: () => void;
  getIsExecuting: () => boolean;
  getFeedback: () => FeedbackMessage;
  setFeedback: (message: string | null, helpKey?: string | null) => void;
  resetFeedback: () => void;
  handleUnmount: () => void;
  handleErrors: (err: unknown) => void;
  runtimesInconsistent: boolean;
  handleGetAddress: (
    txMetadataChainId: string,
    accountIndex: number,
    ss58Prefix: number
  ) => Promise<void>;
  handleSignTx: (
    txMetadataChainId: string,
    uid: number,
    index: number,
    payload: AnyJson
  ) => Promise<void>;
  handleResetLedgerTask: () => void;
}

export interface FeedbackMessage {
  message: string | null;
  helpKey?: string | null;
}

export type LedgerStatusCode =
  | 'GettingAddress'
  | 'ReceivedAddress'
  | 'SigningPayload'
  | 'SignedPayload'
  | 'DeviceBusy'
  | 'DeviceTimeout'
  | 'MethodNotSupported'
  | 'NestingNotSupported'
  | 'WrongTransaction'
  | 'DeviceNotConnected'
  | 'DeviceLocked'
  | 'TransactionVersionNotSupported'
  | 'TransactionRejected'
  | 'AppNotOpenContinue'
  | 'AppNotOpen';

export interface LedgerResponse {
  ack: string;
  statusCode: LedgerStatusCode;
  body?: AnyJson;
  options?: AnyJson;
}

export type LedgerTask = 'get_address' | 'sign_tx';

export type PairingStatus = 'paired' | 'unpaired' | 'unknown';

export interface LedgerChain {
  network: DirectoryId;
  txMetadataChainId: string;
}

export interface HandleErrorFeedback {
  message: string | null;
  helpKey?: string | null;
  code: LedgerStatusCode;
}
