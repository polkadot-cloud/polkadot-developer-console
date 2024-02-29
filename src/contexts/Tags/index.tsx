// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { defaultTags, defaultTagsConfig, defaultTagsContext } from './defaults';
import type { TagsConfig, TagsContextInterface, TagsList } from './types';
import { setStateWithRef } from '@w3ux/utils';

export const TagsContext =
  createContext<TagsContextInterface>(defaultTagsContext);

export const useTags = () => useContext(TagsContext);

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  // Tags currently present in the system.
  const [tags, setTags] = useState<TagsList>(defaultTags);

  // Initial tags config, mapping a tag to chain names. NOTE: ref is used as tagsConfig is accessed
  // in callbacks.
  const [tagsConfig, setTagsConfig] = useState<TagsConfig>(defaultTagsConfig);
  const tagsConfigRef = useRef(tagsConfig);

  // Get the largest tag id existing in `tags`.
  // TODO: refactor - no longer works.
  const getLargesTagId = () => {
    const largestId =
      [...Object.keys(tags)].sort((a, b) => Number(b) - Number(a))?.[0] || 0;
    return Number(largestId);
  };

  // Gets the tags config of a chain.
  const getTagsForChain = (chain: string): string[] =>
    Object.entries(tagsConfig)
      .filter(([, chains]) => chains.includes(chain))
      .map(([tag]) => tag);

  // Gets the chains currently applied to a tag.
  const getChainsForTag = (tagId: string): string[] => tagsConfig[tagId];

  // Removes a tag by its id, along with configs tied to it.
  const removeTag = (tagId: string) => {
    const newTags = { ...tags };
    const newTagsConfig = { ...tagsConfig };

    delete newTags[tagId];
    delete newTagsConfig[tagId];

    setTags(newTags);
    setStateWithRef(newTagsConfig, setTagsConfig, tagsConfigRef);
  };

  // Add a chain to a tag config.
  const addChainToTag = (tagId: string, chain: string) => {
    const newTagsConfig = { ...tagsConfigRef.current };
    newTagsConfig[tagId] = [...(newTagsConfig?.[tagId] || []), chain];
    setStateWithRef(newTagsConfig, setTagsConfig, tagsConfigRef);
  };

  // Remove a chain from a tab config.
  const removeChainFromTag = (tagId: string, chain: string) => {
    const newTagsConfig = { ...tagsConfigRef.current };
    newTagsConfig[tagId] = newTagsConfig[tagId].filter((c) => c !== chain);
    setStateWithRef(newTagsConfig, setTagsConfig, tagsConfigRef);
  };

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
        removeTag,
        addChainToTag,
        removeChainFromTag,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};
