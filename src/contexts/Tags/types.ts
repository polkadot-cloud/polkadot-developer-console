// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, SetStateAction } from 'react';

export interface TagsContextInterface {
  tagsConfig: TagsConfig;
  setTagsConfig: Dispatch<SetStateAction<TagsConfig>>;
  getTagsForChain: (chain: string) => string[];
  tags: TagsList;
  setTags: Dispatch<SetStateAction<TagsList>>;
}

export type TagsList = Record<number, string>;

export type TagsConfig = Record<number, TagConfigItem>;

export type TagConfigItem = string[];
