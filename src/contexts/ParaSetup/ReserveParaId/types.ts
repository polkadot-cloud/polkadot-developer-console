// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks/types';

export interface ReserveParaIdContextInterface {
  getNextParaId: (chainId: ChainId) => string | undefined;
  setNextParaId: (chainId: ChainId, paraId: string) => void;
  removeNextParaId: (chainId: ChainId) => void;
  nextParaIdChainExists: (chainId: ChainId) => boolean;
  addNextParaIdChain: (chainId: ChainId) => void;
  removeNextParaIdChain: (chainId: ChainId) => void;

  getSelectedAccount: (tabId: number) => string | undefined;
  setSelectedAccount: (tabId: number, account: string) => void;
  removeSelectedAccount: (tabId: number) => void;

  getSelectedOption: (tabId: number) => ReserveOption;
  setSelectedOption: (tabId: number, option: ReserveOption) => void;
  removeSelectedOption: (tabId: number) => void;

  getExistingParaIdInput: (tabId: number) => string;
  removeExistingParaIdInput: (tabId: number) => void;
  setExistingParaIdInput: (tabId: number, paraId: string) => void;

  getExistingReservedParaId: (
    tabId: number
  ) => ReservedParaId | null | undefined;
  setExistingReservedParaId: (
    tabId: number,
    reservedParaId: ReservedParaId | null
  ) => void;
  removeExistingReservedParaId: (tabId: number) => void;

  getReservedNextParaId: (
    tabId: number,
    manager: string
  ) => ParaIdWithManager | undefined;
  setReservedNextParaId: (
    tabId: number,
    manager: string,
    paraId: string
  ) => void;
  removeReservedNextParaId: (tabId: number) => void;

  validateParaId: (
    tabId: number,
    manager: string
  ) => ParaIdWithManager | undefined;
}

export type ReserveOption = 'new' | 'existing';

export interface ReservedParaId {
  id: string;
  deposit: string;
  locked: boolean;
  manager: string;
}

// Reserved next para ids for a tab, keyed by account.
export type ReservedNextParaIds = Record<string, ParaIdWithManager>;

export interface ParaIdWithManager {
  paraId: string;
  manager: string;
}
