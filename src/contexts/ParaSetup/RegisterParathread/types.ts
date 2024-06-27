// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface RegisterParathreadContextInterface {
  getRuntimeValue: (tabId: number) => string | undefined;
  setRuntimeValue: (tabId: number, value: string) => void;
  getGenesisState: (tabId: number) => string | undefined;
  setGenesisState: (tabId: number, value: string) => void;
  removeTabParathreadData: (tabId: number) => void;
}

export type RuntimeValues = Record<number, string>;
