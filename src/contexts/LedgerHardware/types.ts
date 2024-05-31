// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { DirectoryId } from 'config/networks/types';

export interface LedgerHardwareContextInterface {
  integrityChecked: boolean;
  setIntegrityChecked: (checked: boolean) => void;
  checkRuntimeVersion: (
    appName: string,
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
  handleErrors: (appName: string, err: unknown) => void;
  runtimesInconsistent: boolean;
  handleGetAddress: (appName: string, accountIndex: number) => Promise<void>;
  handleSignTx: (
    appName: string,
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

export interface LedgerApp {
  network: DirectoryId;
  appName: string;
}

export interface HandleErrorFeedback {
  message: string | null;
  helpKey?: string | null;
  code: LedgerStatusCode;
}
