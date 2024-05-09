// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import { defaultActiveBalances } from 'hooks/useActiveBalances/defaults';
import type { ChainSpaceEnvContextInterface } from './types';

export const defaultChainSpaceEnvContext: ChainSpaceEnvContextInterface = {
  activeBalances: defaultActiveBalances,
  handleConnectApi: (chainId, rovider) => Promise.resolve(0),
  getChainApi: (index) => undefined,
  destroyChainApi: (index) => {},
  getApiStatusByIndex: (index) => 'disconnected',
};
