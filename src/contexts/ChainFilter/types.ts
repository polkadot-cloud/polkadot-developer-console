// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { TagId, TagItem } from 'contexts/Tags/types';

export interface ChainFilterInterface {
  searchTerms: SearchTerms;
  getSearchTerm: (tabId: number) => string;
  setSearchTerm: (tabId: number, searchTerm: string) => void;
  appliedTags: AppliedTags;
  getAppliedTags: (tabId: number) => [ChainId, TagItem][];
  applyTags: (tabId: number, tagIds: TagId[]) => void;
  removeAppliedTag: (tabId: number | '*', tagId: TagId) => void;
}

export type SearchTerms = Record<number, string>;

export type AppliedTags = Record<number, TagId[]>;
