// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type { AppliedTags, ChainFilterInterface, SearchTerms } from './types';
import { defaultAppliedTags, defaultChainFilter } from './defaults';

export const ChainFilter =
  createContext<ChainFilterInterface>(defaultChainFilter);

export const useChainFilter = () => useContext(ChainFilter);

export const ChainFilterProvider = ({ children }: { children: ReactNode }) => {
  // The current search terms.
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({});

  // The current applied tags to a given key.
  const [appliedTags, setAppliedTags] =
    useState<AppliedTags>(defaultAppliedTags);

  // Gets a search term for a given key.
  const getSearchTerm = (tabId: number) => searchTerms[tabId] || '';

  // Sets a search term for a given key.
  const setSearchTerm = (tabId: number, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [tabId]: value }));
  };

  // Gets the applied tags for a given key.
  const getAppliedTags = (tabId: number) => appliedTags[tabId] || [];

  // Sets applioed tags for a given key.
  const applyTags = (tabId: number, tags: string[]) => {
    setAppliedTags((prev) => ({ ...prev, [tabId]: tags }));
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
      }}
    >
      {children}
    </ChainFilter.Provider>
  );
};
