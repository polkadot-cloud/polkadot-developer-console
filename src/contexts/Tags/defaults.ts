// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { TagsConfig, TagsContextInterface, TagsList } from './types';

export const defaultTags: TagsList = {
  tag_0: { name: 'Relay Chain', locked: true },
  tag_1: { name: 'Canary Network', locked: true },
  tag_2: { name: 'Test Network', locked: true },
  tag_3: { name: 'Test Tag', locked: false },
};

export const defaultTagsConfig: TagsConfig = {
  tag_0: ['polkadot-relay-chain', 'kusama-relay-chain', 'westend-relay-chain'],
  tag_1: ['kusama-relay-chain'],
  tag_2: ['westend-relay-chain'],
};

export const defaultTagsContext: TagsContextInterface = {
  tags: {},
  setTags: (newTags) => {},
  tagsConfig: defaultTagsConfig,
  setTagsConfig: (newTagsConfig) => {},
  getTagsForChain: (chain) => [],
  getChainsForTag: (tagId) => [],
  getLargesTagId: () => 0,
  removeTag: (tagId) => {},
  addChainToTag: (tagId, chain) => {},
  removeChainFromTag: (tagId, chain) => {},
};
