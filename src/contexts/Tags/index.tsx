// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { defaultTagsContext } from './defaults';
import type { TagsContextInterface } from './types';

export const TagsContext =
  createContext<TagsContextInterface>(defaultTagsContext);

export const useTags = () => useContext(TagsContext);

export const TagsProvider = ({ children }: { children: ReactNode }) => (
  <TagsContext.Provider value={null}>{children}</TagsContext.Provider>
);
