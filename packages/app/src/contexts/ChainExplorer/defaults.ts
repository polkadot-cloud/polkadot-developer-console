// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0
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
  destroyStateChainExplorer: (tabId) => {},
};

export const defaultCustomEndpointChainMeta = {
  ss58: 0,
  units: 10,
  unit: 'UNIT',
};
