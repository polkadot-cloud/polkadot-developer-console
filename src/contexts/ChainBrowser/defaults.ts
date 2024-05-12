// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ChainBrowserContextInterface } from './types';

export const defaultChainBrowserContext: ChainBrowserContextInterface = {
  getStoredChain: (tabId) => undefined,
  updateSs58: (id, ss58) => {},
  updateUnits: (id, units) => {},
  updateUnit: (id, unit) => {},
  connectChainBrowser: (tabId, chainId, endpoint) => {},
  instantiateApiFromTab: (tabId) => {},
  forgetTabChain: (tabId) => {},
};

export const defaultCustomEndpointChainMeta = {
  ss58: 0,
  units: 10,
  unit: 'UNIT',
};
