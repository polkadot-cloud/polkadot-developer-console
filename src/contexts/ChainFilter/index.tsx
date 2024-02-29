// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { AppliedTags, ChainFilterInterface, SearchTerms } from './types';
import {
  defaultAppliedTags,
  defaultChainFilter,
  defaultSearchTerms,
} from './defaults';
import { useTags } from 'contexts/Tags';
import type { TagId, TagItem } from 'contexts/Tags/types';
import type { ChainId } from 'config/networks';
import * as local from './Local';

export const ChainFilter =
  createContext<ChainFilterInterface>(defaultChainFilter);

export const useChainFilter = () => useContext(ChainFilter);

export const ChainFilterProvider = ({ children }: { children: ReactNode }) => {
  const { tags } = useTags();

  // The current search terms.
  const [searchTerms, setSearchTermsState] = useState<SearchTerms>(
    local.getSearchTerms() || defaultSearchTerms
  );

  // The current applied tags to a given key.
  const [appliedTags, setAppliedTagsState] = useState<AppliedTags>(
    local.getAppliedTags() || defaultAppliedTags
  );

  // Sets search terms state, and updates local storage.
  const setSearchTerms = (value: SearchTerms) => {
    local.setSearchTerms(value);
    setSearchTermsState(value);
  };

  // Sets applied tags state, and updates local storage.
  const setAppliedTags = (value: AppliedTags) => {
    local.setAppliedTags(value);
    setAppliedTagsState(value);
  };

  // Gets a search term for a given key.
  const getSearchTerm = (tabId: number) => searchTerms[tabId] || '';

  // Sets a search term for a given key.
  const setSearchTerm = (tabId: number, value: string) => {
    setSearchTerms({ ...searchTerms, [tabId]: value });
  };

  // Gets the applied tags for a given key.
  const getAppliedTags = (tabId: number): [ChainId, TagItem][] => {
    const tagIds = appliedTags[tabId] || [];
    return tagIds.map((id: TagId) => [id as ChainId, tags[id]]);
  };

  // Sets applied tags for a given key.
  const applyTags = (tabId: number, tagIds: TagId[]) => {
    setAppliedTags({ ...appliedTags, [tabId]: tagIds });
  };

  // Removes a tag for a given key.
  const removeAppliedTag = (tabId: number | '*', tagId: TagId) => {
    // If a tabId is provided as a number, only remove the tag from that tab.
    if (typeof tabId === 'number') {
      setAppliedTags({
        ...appliedTags,
        [tabId]: appliedTags[tabId].filter((item) => item !== tagId),
      });
    } else {
      // If a wildcard tabId is provided, remove the tag from all tabs.
      const newAppliedTags: AppliedTags = {};
      for (const key in appliedTags) {
        newAppliedTags[key] = appliedTags[key].filter((item) => item !== tagId);
      }
      setAppliedTags(newAppliedTags);
    }
  };

  return (
    <ChainFilter.Provider
      value={{
        searchTerms,
        getSearchTerm,
        setSearchTerm,
        getAppliedTags,
        appliedTags,
        applyTags,
        removeAppliedTag,
      }}
    >
      {children}
    </ChainFilter.Provider>
  );
};
