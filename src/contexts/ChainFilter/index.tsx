// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import type {
  AppliedTags,
  ChainFilterInterface,
  CustomEndpoints,
  SearchTerms,
} from './types';
import {
  defaultAppliedTags,
  defaultChainFilter,
  defaultCustomEndpoints,
  defaultSearchTerms,
} from './defaults';
import { useTags } from 'contexts/Tags';
import type { TagId, TagItem } from 'contexts/Tags/types';
import type { DirectoryId } from 'config/networks/types';
import * as local from './Local';
import { checkLocalChainFilter } from 'IntegrityChecks/Local';

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

  // The current custom endpoints.
  const [customEndpoints, setCustomEndpointsState] = useState<CustomEndpoints>(
    local.getCustomEndpoints() || defaultCustomEndpoints
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

  // Sets custom endpoints state, and updates local storage.
  const setCustomEndpoints = (value: CustomEndpoints) => {
    local.setCustomEndpoints(value);
    setCustomEndpointsState(value);
  };

  // Sets applied tags state, and updates local storage.
  const setAppliedTags = (value: AppliedTags) => {
    local.setAppliedTags(value);
    setAppliedTagsState(value);
    appliedTagsRef.current = value;
  };

  // Gets a search term for a given key.
  const getSearchTerm = (tabId: number) => searchTerms[tabId] || '';

  // Gets a custom endpoint for a given key.
  const getCustomEndpoint = (tabId: number) => customEndpoints[tabId] || '';

  // Sets a search term for a given key.
  const setSearchTerm = (tabId: number, value: string) => {
    setSearchTerms({ ...searchTerms, [tabId]: value });
  };

  // Sets a custom endpoint for a given key.
  const setCustomEndpoint = (tabId: number, value: string) => {
    setCustomEndpoints({ ...customEndpoints, [tabId]: value });
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
        customEndpoints,
        getCustomEndpoint,
        setCustomEndpoint,
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
