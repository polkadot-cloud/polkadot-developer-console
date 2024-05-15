// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ChainExplorerContextInterface } from './types';

export const defaultChainExplorerContext: ChainExplorerContextInterface = {
  connectChainExplorer: (ownerId, chainId, endpoint) => {},
  getStoredChain: (tabId) => undefined,
  updateSs58: (id, ss58) => {},
  updateUnits: (id, units) => {},
  updateUnit: (id, unit) => {},
  forgetTabChain: (tabId) => {},
  chainExplorerIntegrityCheck: (tabId) => false,
};

export const defaultCustomEndpointChainMeta = {
  ss58: 0,
  units: 10,
  unit: 'UNIT',
};
