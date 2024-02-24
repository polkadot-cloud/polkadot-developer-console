// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { defaultTags, defaultTagsConfig, defaultTagsContext } from './defaults';
import type { TagsConfig, TagsContextInterface, TagsList } from './types';

export const TagsContext =
  createContext<TagsContextInterface>(defaultTagsContext);

export const useTags = () => useContext(TagsContext);

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  // Tags currently present in the system.
  const [tags, setTags] = useState<TagsList>(defaultTags);

  // Initial tags config, mapping a tag to chain names.
  const [tagsConfig, setTagsConfig] = useState<TagsConfig>(defaultTagsConfig);

  // Get the largest tag id existing in `tags`.
  const getLargesTagId = () => {
    const largestId =
      [...Object.keys(tags)].sort((a, b) => Number(b) - Number(a))?.[0] || 0;
    return Number(largestId);
  };

  // Gets the tags config of a chain.
  const getTagsForChain = (chain: string): string[] =>
    Object.entries(tagsConfig)
      .filter(([, chains]) => chains.includes(chain))
      .map(([tag]) => tags[Number(tag)].name) || [];

  // Gets the chains currently applied to a tag.
  const getChainsForTag = (tag: number): string[] => tagsConfig[tag];

  return (
    <TagsContext.Provider
      value={{
        tags,
        setTags,
        tagsConfig,
        setTagsConfig,
        getTagsForChain,
        getChainsForTag,
        getLargesTagId,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};
