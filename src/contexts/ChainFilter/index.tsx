// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type {
  AppliedTags,
  ChainFilterInterface,
  CustomNodeUrls,
  SearchTerms,
} from './types';
import {
  defaultAppliedTags,
  defaultChainFilter,
  defaultCustomNodeUrls,
  defaultSearchTerms,
} from './defaults';
import { useTags } from 'contexts/Tags';
import type { TagId, TagItem } from 'contexts/Tags/types';
import type { DirectoryId } from 'config/networks';
import * as local from './Local';
import { checkLocalChainFilter } from 'IntegrityChecks';

checkLocalChainFilter();

export const ChainFilter =
  createContext<ChainFilterInterface>(defaultChainFilter);

export const useChainFilter = () => useContext(ChainFilter);

export const ChainFilterProvider = ({ children }: { children: ReactNode }) => {
  const { tags } = useTags();

  // The current search terms.
  const [searchTerms, setSearchTermsState] = useState<SearchTerms>(
    local.getSearchTerms() || defaultSearchTerms
  );

  // The current custom node urls.
  const [customNodeUrls, setCustomNodeUrlsState] = useState<CustomNodeUrls>(
    local.getCustomNodeUrls() || defaultCustomNodeUrls
  );

  // The current applied tags to a given key. NOTE: needs a ref for up to date state updates in
  // context menu.
  const [appliedTags, setAppliedTagsState] = useState<AppliedTags>(
    local.getAppliedTags() || defaultAppliedTags
  );
  const appliedTagsRef = useRef(appliedTags);

  // Sets search terms state, and updates local storage.
  const setSearchTerms = (value: SearchTerms) => {
    local.setSearchTerms(value);
    setSearchTermsState(value);
  };

  // Sets custom node urls state, and updates local storage.
  const setCustomNodeUrls = (value: SearchTerms) => {
    local.setCustomNodeUrls(value);
    setCustomNodeUrlsState(value);
  };

  // Sets applied tags state, and updates local storage.
  const setAppliedTags = (value: AppliedTags) => {
    local.setAppliedTags(value);
    setAppliedTagsState(value);
    appliedTagsRef.current = value;
  };

  // Gets a search term for a given key.
  const getSearchTerm = (tabId: number) => searchTerms[tabId] || '';

  // Gets a custom node url for a given key.
  const getCustomNodeUrl = (tabId: number) => customNodeUrls[tabId] || '';

  // Sets a search term for a given key.
  const setSearchTerm = (tabId: number, value: string) => {
    setSearchTerms({ ...searchTerms, [tabId]: value });
  };

  // Sets a custom node url for a given key.
  const setCustomNodeUrl = (tabId: number, value: string) => {
    setCustomNodeUrls({ ...customNodeUrls, [tabId]: value });
  };

  // Gets the applied tags for a given key.
  const getAppliedTags = (tabId: number): [DirectoryId, TagItem][] => {
    const tagIds = appliedTags[tabId] || [];
    return tagIds.map((id: TagId) => [id as DirectoryId, tags[id]]);
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
        ...appliedTagsRef.current,
        [tabId]: appliedTagsRef.current[tabId].filter((item) => item !== tagId),
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
        customNodeUrls,
        getCustomNodeUrl,
        setCustomNodeUrl,
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
