// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { defaultTagsConfig, defaultTagsContext } from './defaults';
import type { TagsConfig, TagsContextInterface } from './types';

export const TagsContext =
  createContext<TagsContextInterface>(defaultTagsContext);

export const useTags = () => useContext(TagsContext);

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  // Initial tags config, mapping a tag to chain names.
  const [tagsConfig, setTagsConfig] = useState<TagsConfig>(defaultTagsConfig);

  // Gets the tags config of a chain.
  const getTagsForChain = (chain: string): string[] =>
    Object.entries(tagsConfig)
      .filter(([, chains]) => chains.includes(chain))
      .map(([tag]) => tag) || [];

  return (
    <TagsContext.Provider
      value={{ tagsConfig, setTagsConfig, getTagsForChain }}
    >
      {children}
    </TagsContext.Provider>
  );
};
