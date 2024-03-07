// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { TagsConfig, TagsContextInterface, TagsList } from './types';

export const defaultTags: TagsList = {
  tag_relay_chain: { name: 'Relay Chain', locked: true, counter: 0 },
  tag_canary_network: { name: 'Canary Network', locked: true, counter: 1 },
  tag_test_network: { name: 'Test Network', locked: true, counter: 2 },
};

export const defaultTagsConfig: TagsConfig = {
  tag_relay_chain: ['polkadot', 'kusama', 'westend'],
  tag_canary_network: ['kusama'],
  tag_test_network: ['westend'],
};

export const defaultTagsContext: TagsContextInterface = {
  tags: {},
  setTags: (newTags) => {},
  tagsConfig: defaultTagsConfig,
  setTagsConfig: (newTagsConfig) => {},
  getTagsForChain: (chain) => [],
  getChainsForTag: (tagId) => [],
  getLargestTagCounter: () => 0,
  removeTag: (tagId) => {},
  addChainToTag: (tagId, chain) => {},
  removeChainFromTag: (tagId, chain) => {},
};
