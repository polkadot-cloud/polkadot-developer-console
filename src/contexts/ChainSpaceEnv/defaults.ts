// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { APIChainSpec } from 'model/Api/types';
import type { ChainSpaceEnvContextInterface } from './types';

export const defaultChainSpaceEnvContext: ChainSpaceEnvContextInterface = {
  getApiStatus: (instanceId) => 'disconnected',
  getChainSpec: (instanceId) => undefined,
  getPalletVersions: (ownerId) => undefined,
  handleConnectApi: (ownerId, label, chainId, provider) => Promise.resolve(),
  getApiInstanceById: (instanceId) => undefined,
  getApiInstance: (ownerId, label) => undefined,
  destroyApiInstance: (ownerId, label) => {},
  destroyAllApiInstances: (ownerId) => {},
  instantiateApiFromTab: (tabId) => {},
  getConnectedChains: () => [],
  allActiveChainsConnected: () => false,
};

// NOTE: Only dummy values to keep the type checker happy. They should be over-written by the
// initial context values upon initialisation.
export const dummyChainSpec: APIChainSpec = {
  chain: '',
  version: {
    apis: {},
    authoringVersion: 0,
    implName: '',
    implVersion: 0,
    specName: 'polkadot',
    specVersion: 0,
    stateVersion: 0,
    transactionVersion: 0,
  },
  ss58Prefix: 0,
  magicNumber: 0,
  metadata: {},
  consts: {},
};
