// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DirectoryId } from 'config/networks';
import type { TagId, TagItem } from 'contexts/Tags/types';

export interface ChainFilterInterface {
  searchTerms: SearchTerms;
  getSearchTerm: (tabId: number) => string;
  setSearchTerm: (tabId: number, searchTerm: string) => void;
  customNodeUrls: CustomNodeUrls;
  getCustomNodeUrl: (tabId: number) => string;
  setCustomNodeUrl: (tabId: number, url: string) => void;
  appliedTags: AppliedTags;
  getAppliedTags: (tabId: number) => [DirectoryId, TagItem][];
  applyTags: (tabId: number, tagIds: TagId[]) => void;
  removeAppliedTag: (tabId: number | '*', tagId: TagId) => void;
}

export type SearchTerms = Record<number, string>;

export type CustomNodeUrls = Record<number, string>;

export type AppliedTags = Record<number, TagId[]>;
