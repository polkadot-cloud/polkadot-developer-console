// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { TagsConfig, TagsContextInterface, TagsList } from './types';

export const defaultTags: TagsList = {
  tag_relay_chain: { name: 'Relay Chain', locked: true, counter: 0 },
  tag_canary_network: { name: 'Canary Network', locked: true, counter: 1 },
  tag_test_network: { name: 'Test Network', locked: true, counter: 2 },
  tag_system_chain: { name: 'System Chain', locked: true, counter: 3 },
  tag_polkadot_network: { name: 'Polkadot Network', locked: true, counter: 4 },
  tag_kusama_network: { name: 'Kusama Network', locked: true, counter: 5 },
  tag_westend_network: { name: 'Westend Network', locked: true, counter: 6 },
  tag_rococo_network: { name: 'Rococo Network', locked: true, counter: 7 },
};

export const defaultTagsConfig: TagsConfig = {
  tag_relay_chain: ['polkadot', 'kusama', 'rococo', 'westend'],
  tag_canary_network: ['kusama'],
  tag_test_network: ['rococo', 'westend'],
  tag_system_chain: ['statemint', 'bridge-hub-polkadot', 'collectives'],
  tag_polkadot_network: [
    'polkadot',
    'statemint',
    'bridge-hub-polkadot',
    'collectives',
  ],
  tag_kusama_network: ['kusama'],
  tag_westend_network: ['westend'],
  tag_rococo_network: ['rococo'],
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
