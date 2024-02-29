// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';
import type { AppliedTags, SearchTerms } from './types';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved search terms from local storage, or returns undefined otherwise.
export const getSearchTerms = (): SearchTerms | undefined => {
  const result = localStorageOrDefault('searchTerms', undefined, true) as
    | SearchTerms
    | undefined;

  if (result) {
    return result as SearchTerms;
  }
};

// Gets applied tags from local storage, or returns undefined otherwise.
export const getAppliedTags = (): AppliedTags | undefined => {
  const result = localStorageOrDefault('appliedTags', undefined, true) as
    | AppliedTags
    | undefined;

  if (result) {
    return result as AppliedTags;
  }
};

// ------------------------------------------------------
// Setters.
// ------------------------------------------------------

// Sets search terms to local storage.
export const setSearchTerms = (value: SearchTerms) => {
  localStorage.setItem('searchTerms', JSON.stringify(value));
};

// Sets applied tags to local storage.
export const setAppliedTags = (value: AppliedTags) => {
  localStorage.setItem('appliedTags', JSON.stringify(value));
};
