// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import { defaultActiveBalances } from 'hooks/useActiveBalances/defaults';
import type { ChainSpaceEnvContextInterface } from './types';

export const defaultChainSpaceEnvContext: ChainSpaceEnvContextInterface = {
  activeBalances: defaultActiveBalances,
  relayChain: 'polkadot',
  relayInstance: undefined,
  setRelayChain: (value) => {},
  relayApiStatus: 'disconnected',
  relayInstanceIndex: undefined,
  handleConnectApi: (provider) => {},
};
