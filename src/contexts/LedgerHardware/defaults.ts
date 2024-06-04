// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { LedgerApp, LedgerHardwareContextInterface } from './types';

// The supported networks and the corresponding Ledger app name.
export const LedgerApps: LedgerApp[] = [
  {
    network: 'polkadot',
    appName: 'Polkadot',
  },
  {
    network: 'kusama',
    appName: 'Kusama',
  },
];

// Default empty feedback message.
export const defaultFeedback = {
  message: null,
  helpKey: null,
};

// Default ledger hardware context interface.
export const defaultLedgerHardwareContext: LedgerHardwareContextInterface = {
  transportResponse: null,
  integrityChecked: false,
  setIntegrityChecked: (checked) => {},
  checkRuntimeVersion: async (appName, transactionVersion) =>
    new Promise((resolve) => resolve()),
  setStatusCode: (ack, newStatusCode) => {},
  setIsExecuting: (val) => {},
  getIsExecuting: () => false,
  getStatusCode: () => null,
  resetStatusCode: () => {},
  getFeedback: () => defaultFeedback,
  setFeedback: (message, helpKey) => {},
  resetFeedback: () => {},
  handleUnmount: () => {},
  handleErrors: (appName, err) => {},
  handleGetAddress: (appName, accountIndex) =>
    new Promise((resolve) => resolve()),
  handleSignTx: (appName, uid, index, payload) =>
    new Promise((resolve) => resolve()),
  handleResetLedgerTask: () => {},
  runtimesInconsistent: false,
};
