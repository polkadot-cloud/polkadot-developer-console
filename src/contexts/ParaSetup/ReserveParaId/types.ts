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

  getSelectedOption: (tabId: number) => ReserveOption;
  setSelectedOption: (tabId: number, option: ReserveOption) => void;

  getExistingParaIdInput: (tabId: number) => string;
  setExistingParaIdInput: (tabId: number, paraId: string) => void;

  getExistingReservedParaId: (
    tabId: number
  ) => ReservedParaId | null | undefined;
  setExistingReservedParaId: (
    tabId: number,
    reservedParaId: ReservedParaId | null
  ) => void;

  getReservedNextParaId: (
    tabId: number,
    manager: string
  ) => ParaIdWithManager | undefined;
  setReservedNextParaId: (
    tabId: number,
    manager: string,
    paraId: string
  ) => void;

  validateParaId: (
    tabId: number,
    manager: string
  ) => ParaIdWithManager | undefined;

  removeTabParaIdData: (tabId: number) => void;
}

export type ReservedParaIdData = Record<number, ReserveParaIdState>;

export interface ReserveParaIdState {
  selectedAccount?: string;
  selectedOption?: ReserveOption;
  existingParaIdInput?: string;
  existingReservedParaId?: ReservedParaId | null;
  reservedNextParaIds?: ReservedNextParaIds;
}

export type ReserveOption = 'new' | 'existing';

export interface ReservedParaId {
  paraId: string;
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
