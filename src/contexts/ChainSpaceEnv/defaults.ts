// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import { defaultActiveBalances } from 'hooks/useActiveBalances/defaults';
import type { ChainSpaceEnvContextInterface } from './types';

export const defaultChainSpaceEnvContext: ChainSpaceEnvContextInterface = {
  getApiStatusByIndex: (index) => 'disconnected',
  getApiActiveByIndex: (index) => false,
  getChainSpecByIndex: (index) => undefined,
  activeBalances: defaultActiveBalances,
  handleConnectApi: (tabId, label, chainId, rovider) => Promise.resolve(),
  getChainApi: (index) => undefined,
  destroyChainApi: (index) => {},
  getNextApiIndex: () => 0,
  destroyChainSpaceEnvIndex: (index) => {},
};
