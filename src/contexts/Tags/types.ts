// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainId } from 'config/networks';
import type { Dispatch, SetStateAction } from 'react';

export type ConcreteTagId =
  | 'tag_relay_chain'
  | 'tag_canary_network'
  | 'tag_test_network';

export type CustomTagId = string;

export type TagId = ConcreteTagId | CustomTagId;

export interface TagsContextInterface {
  tags: TagsList;
  setTags: Dispatch<SetStateAction<TagsList>>;
  tagsConfig: TagsConfig;
  setTagsConfig: Dispatch<SetStateAction<TagsConfig>>;
  getTagsForChain: (chain: ChainId) => TagId[];
  getChainsForTag: (tagId: TagId) => ChainId[];
  getLargestTagCounter: () => number;
  removeTag: (tagId: TagId) => void;
  addChainToTag: (tagId: TagId, chain: ChainId) => void;
  removeChainFromTag: (tagId: TagId, chain: ChainId) => void;
}

export interface TagItem {
  name: string;
  locked: boolean;
  counter: number;
}

export type TagsList = Record<TagId, TagItem>;

export type TagsConfig = Record<TagId, TagConfigItem>;

export type TagConfigItem = ChainId[];
