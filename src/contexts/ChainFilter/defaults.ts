// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type {
  AppliedTags,
  ChainFilterInterface,
  CustomNodeUrls,
  SearchTerms,
} from './types';

export const defaultChainFilter: ChainFilterInterface = {
  searchTerms: {},
  getSearchTerm: (tabId) => '',
  setSearchTerm: (tabId, searchTerm) => {},
  customNodeUrls: {},
  getCustomNodeUrl: (tabId) => '',
  setCustomNodeUrl: (tabId, url) => {},
  appliedTags: {},
  getAppliedTags: (tabId) => [],
  applyTags: (tabId, tagIds) => {},
  removeAppliedTag: (tabId, tagId) => {},
};

export const defaultAppliedTags: AppliedTags = {
  1: ['tag_relay_chain'],
  2: ['tag_canary_network'],
  3: ['tag_test_network'],
  4: ['tag_test_network'],
};

export const defaultSearchTerms: SearchTerms = {
  1: '',
  2: 'Kusama',
  3: 'Rococo',
  4: 'Westend',
};

export const defaultCustomNodeUrls: CustomNodeUrls = {};
