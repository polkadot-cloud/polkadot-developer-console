// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TagItem } from 'contexts/Tags/types';

export interface ChainFilterInterface {
  searchTerms: SearchTerms;
  getSearchTerm: (tabId: number) => string;
  setSearchTerm: (tabId: number, searchTerm: string) => void;
  appliedTags: AppliedTags;
  getAppliedTags: (tabId: number) => [string, TagItem][];
  applyTags: (tabId: number, tags: string[]) => void;
  removeTag: (tabId: number, tagId: string) => void;
}

export type SearchTerms = Record<number, string>;

export type AppliedTags = Record<number, string[]>;
