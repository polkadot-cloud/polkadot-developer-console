// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { DirectoryId } from 'config/networks/types';

export type ConcreteTagId =
  | 'tag_relay_chain'
  | 'tag_canary_network'
  | 'tag_system_chain'
  | 'tag_test_network';

export type CustomTagId = string;

export type TagId = ConcreteTagId | CustomTagId;

export interface TagsContextInterface {
  tags: TagsList;
  setTags: (tags: TagsList) => void;
  tagsConfig: TagsConfig;
  setTagsConfig: (tagsConfig: TagsConfig) => void;
  getTagsForChain: (chain: DirectoryId) => TagId[];
  getChainsForTag: (tagId: TagId) => DirectoryId[];
  getLargestTagCounter: () => number;
  removeTag: (tagId: TagId) => void;
  addChainToTag: (tagId: TagId, chain: DirectoryId) => void;
  removeChainFromTag: (tagId: TagId, chain: DirectoryId) => void;
}

export interface TagItem {
  name: string;
  locked: boolean;
  counter: number;
}

export type TagsList = Record<TagId, TagItem>;

export type TagsConfig = Record<TagId, TagConfigItem>;

export type TagConfigItem = DirectoryId[];
