// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface ChainFilterInterface {
  searchTerms: SearchTerms;
  getSearchTerm: (tabId: number) => string;
  setSearchTerm: (tabId: number, searchTerm: string) => void;
  appliedTags: AppliedTags;
  getAppliedTags: (tabId: number) => string[];
  applyTags: (tabId: number, tags: string[]) => void;
  removeTag: (tabId: number, tag: string) => void;
}

export type SearchTerms = Record<number, string>;

export type AppliedTags = Record<number, string[]>;
