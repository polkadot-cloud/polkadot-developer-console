// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ReserveParaIdContextInterface } from './types';

export const defaultReserveParaIdContext: ReserveParaIdContextInterface = {
  getNextParaId: (chainId) => undefined,
  setNextParaId: (chainId, paraId) => {},
  removeNextParaId: (chainId) => {},
  nextParaIdChainExists: (chainId) => false,
  addNextParaIdChain: (chainId) => {},
  removeNextParaIdChain: (chainId) => {},

  getSelectedAccount: (tabId) => undefined,
  setSelectedAccount: (tabId, account) => {},

  getSelectedOption: (tabId) => 'new',
  setSelectedOption: (tabId, option) => {},

  getExistingParaIdInput: (tabId) => '',
  setExistingParaIdInput: (tabId, paraId) => {},

  getExistingReservedParaId: (tabId) => undefined,
  setExistingReservedParaId: (tabId, reservedParaId) => {},

  getReservedNextParaId: (tabId, manager) => undefined,
  setReservedNextParaId: (tabId, manager, paraId) => {},

  validateParaId: (tabId, manager) => undefined,

  removeTabParaIdData: (tabId) => {},
};
