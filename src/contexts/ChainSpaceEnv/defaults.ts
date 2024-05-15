// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ChainSpaceEnvContextInterface } from './types';

export const defaultChainSpaceEnvContext: ChainSpaceEnvContextInterface = {
  getApiStatus: (instanceId) => 'disconnected',
  getChainSpec: (instanceId) => undefined,
  handleConnectApi: (ownerId, label, chainId, rovider) => Promise.resolve(),
  getApiInstance: (ownerId, label) => undefined,
  destroyApiInstance: (ownerId, label) => {},
  destroyAllApiInstances: (ownerId) => {},
  instantiateApiFromTab: (tabId) => {},
};

// NOTE: Only dummy values to keep the type checker happy. They should be over-written by the
// initial context values upon initialisation.
export const dummyChainSpec = {
  chain: '',
  version: {
    apis: {},
    authoringVersion: 0,
    implName: '',
    implVersion: 0,
    specName: '',
    specVersion: 0,
    stateVersion: 0,
    transactionVersion: 0,
  },
  ss58Prefix: 0,
  magicNumber: 0,
  metadata: {},
  consts: {},
};
