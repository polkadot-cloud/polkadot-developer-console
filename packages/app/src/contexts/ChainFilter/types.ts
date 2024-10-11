// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { DirectoryId } from 'config/networks/types';
import type { TagId, TagItem } from 'contexts/Tags/types';

export interface ChainFilterInterface {
  searchTerms: SearchTerms;
  getSearchTerm: (tabId: number) => string;
  setSearchTerm: (tabId: number, searchTerm: string) => void;
  customEndpoints: CustomEndpoints;
  getCustomEndpoint: (tabId: number) => string;
  setCustomEndpoint: (tabId: number, url: string) => void;
  appliedTags: AppliedTags;
  getAppliedTags: (tabId: number) => [DirectoryId, TagItem][];
  applyTags: (tabId: number, tagIds: TagId[]) => void;
  removeAppliedTag: (tabId: number | '*', tagId: TagId) => void;
  destroyChainFilter: (tabId: number) => void;
}

export type SearchTerms = Record<number, string>;

export type CustomEndpoints = Record<number, string>;

export type AppliedTags = Record<number, TagId[]>;
