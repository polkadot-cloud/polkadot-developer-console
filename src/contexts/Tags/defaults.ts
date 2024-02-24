// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { TagsConfig, TagsContextInterface, TagsList } from './types';

export const defaultTags: TagsList = {
  0: 'Relay Chain',
  1: 'Canary Network',
  2: 'Test Network',
};

export const defaultTagsConfig: TagsConfig = {
  0: ['polkadot-relay-chain', 'kusama-relay-chain', 'westend-relay-chain'],
  1: ['kusama-relay-chain'],
  2: ['westend-relay-chain'],
};

export const defaultTagsContext: TagsContextInterface = {
  tags: {},
  setTags: (newTags) => {},
  tagsConfig: defaultTagsConfig,
  setTagsConfig: (newTagsConfig) => {},
  getTagsForChain: (chain) => [],
  getChainsForTag: (tagId) => [],
};
