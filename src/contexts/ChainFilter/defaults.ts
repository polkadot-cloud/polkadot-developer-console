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
  applyTags: (tabId, tags) => {},
  removeTag: (tabId, tag) => {},
};

export const defaultAppliedTags = {
  1: ['Relay Chain', 'Test Network', 'Canary Network'],
  2: ['Relay Chain', 'Canary Network'],
  3: ['Relay Chain', 'Test Network'],
};
