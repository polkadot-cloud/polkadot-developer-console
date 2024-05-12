// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface ApiIndexerContextInterface {
  getTabApiIndexes: (tabId: number) => ApiIndex[];
  getTabApiIndex: (tabId: number, label: string) => ApiIndex | undefined;
  setTabApiIndex: (tabId: number, index: ApiIndex) => void;
  removeTabApiIndexes: (tabId: number) => void;
  removeTabApiIndex: (tabId: number, label: string) => void;
}

export type ApiIndexes = Record<number, ApiIndex[]>;

export interface ApiIndex {
  index: number;
  label: string;
}
