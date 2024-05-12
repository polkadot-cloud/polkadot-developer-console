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
};
