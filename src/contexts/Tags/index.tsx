// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { defaultTags, defaultTagsConfig, defaultTagsContext } from './defaults';
import type {
  CustomTagId,
  TagId,
  TagsConfig,
  TagsContextInterface,
  TagsList,
} from './types';
import { setStateWithRef } from '@w3ux/utils';
import type { ChainId } from 'config/networks';

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

  // Get a new largest tag counter existing in `tags`.
  const getLargestTagCounter = () => {
    const newLargest =
      [...Object.values(tags)].sort((a, b) => b.counter - a.counter)?.[0]
        .counter || 0;
    return Number(newLargest);
  };

  // Gets the tags config of a chain.
  const getTagsForChain = (chain: ChainId) =>
    Object.entries(tagsConfig)
      .filter(([, chains]) => chains.includes(chain))
      .map(([tag]) => tag);

  // Gets the chains currently applied to a tag.
  const getChainsForTag = (tagId: TagId) => tagsConfig[tagId];

  // Removes a tag by its id, along with configs tied to it.
  const removeTag = (tagId: CustomTagId) => {
    const newTags = { ...tags };
    const newTagsConfig = { ...tagsConfig };

    delete newTags[tagId];
    delete newTagsConfig[tagId];

    setTags(newTags);
    setStateWithRef(newTagsConfig, setTagsConfig, tagsConfigRef);
  };

  // Add a chain to a tag config.
  const addChainToTag = (tagId: TagId, chain: ChainId) => {
    const newTagsConfig = { ...tagsConfigRef.current };
    newTagsConfig[tagId] = [...(newTagsConfig?.[tagId] || []), chain];
    setStateWithRef(newTagsConfig, setTagsConfig, tagsConfigRef);
  };

  // Remove a chain from a tab config.
  const removeChainFromTag = (tagId: TagId, chain: string) => {
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
        getLargestTagCounter,
        removeTag,
        addChainToTag,
        removeChainFromTag,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};
