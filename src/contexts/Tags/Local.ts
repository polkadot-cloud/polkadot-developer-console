// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';
import type { TagsConfig, TagsList } from './types';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved tags from local storage, or returns undefined otherwise.
export const getTags = (): TagsList | undefined => {
  const result = localStorageOrDefault('tags', undefined, true) as
    | TagsList
    | undefined;

  if (result) {
    return result as TagsList;
  }
};

// Gets saved tags config from local storage, or returns undefined otherwise.
export const getTagsConfig = () => {
  const result = localStorageOrDefault('tagsConfig', undefined, true) as
    | TagsConfig
    | undefined;

  if (result) {
    return result as TagsConfig;
  }
};

// ------------------------------------------------------
// Setters.
// ------------------------------------------------------

// Sets tags state to local storage.
export const setTags = (tags: TagsList) => {
  localStorage.setItem('tags', JSON.stringify(tags));
};

// Sets tags config state to local storage.
export const setTagsConfig = (tagsConfig: TagsConfig) => {
  localStorage.setItem('tagsConfig', JSON.stringify(tagsConfig));
};
