// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ChainFilterInterface } from './types';

export const defaultChainFilter: ChainFilterInterface = {
  searchTerms: {},
  getSearchTerm: (tabId) => '',
  setSearchTerm: (tabId, searchTerm) => {},
  appliedTags: {},
  getAppliedTags: (tabId) => [],
  applyTags: (tabId, tagIds) => {},
  removeTag: (tabId, tagId) => {},
};

export const defaultAppliedTags = {
  1: ['tag_relay_chain', 'tag_canary_network', 'tag_test_network'],
  2: ['tag_canary_network'],
  3: ['tag_test_network'],
};

export const defaultSearchTerms = {
  1: '',
  2: 'Kusama',
  3: 'Westend',
};
