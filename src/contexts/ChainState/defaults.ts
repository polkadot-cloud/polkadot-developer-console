// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ChainStateContextInterface } from './types';

export const defaultChainStateContext: ChainStateContextInterface = {
  getChainStateByType: (type) => ({}),
  getChainStateItem: (key) => null,
  removeChainStateItem: (type, key) => {},
  setConstant: (key, value) => ({}),
  getTotalChainStateItems: () => 0,
  chainStateConstants: {},
  setItemPinned: (type, subscriptionKey, pinned) => {},
};
