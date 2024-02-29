// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, SetStateAction } from 'react';

export interface TagsContextInterface {
  tags: TagsList;
  setTags: Dispatch<SetStateAction<TagsList>>;
  tagsConfig: TagsConfig;
  setTagsConfig: Dispatch<SetStateAction<TagsConfig>>;
  getTagsForChain: (chain: string) => string[];
  getChainsForTag: (tagId: string) => string[];
  getLargesTagId: () => number;
  removeTag: (tagId: string) => void;
  addChainToTag: (tagId: string, chain: string) => void;
  removeChainFromTag: (tagId: string, chain: string) => void;
}

export interface TagItem {
  name: string;
  locked: boolean;
}

export type TagsList = Record<string, TagItem>;

export type TagsConfig = Record<string, TagConfigItem>;

export type TagConfigItem = string[];
