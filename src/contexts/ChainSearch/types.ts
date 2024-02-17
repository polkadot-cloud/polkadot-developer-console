// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface ChainSearchContextInterface {
  searchTerms: SearchTerms;
  setSearchTerm: (key: string, searchTerm: string) => void;
  appliedTags: AppliedTags;
  applyTags: (key: string, tags: string[]) => void;
}

export type SearchTerms = Record<number, string>;

export type AppliedTags = Record<number, string[]>;
