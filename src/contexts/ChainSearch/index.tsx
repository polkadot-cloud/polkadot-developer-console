// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type {
  AppliedTags,
  ChainSearchContextInterface,
  SearchTerms,
} from './types';
import { defaultChainSearchContext } from './defaults';

export const ChainSearchContext = createContext<ChainSearchContextInterface>(
  defaultChainSearchContext
);

export const useChainSearch = () => useContext(ChainSearchContext);

export const ChainSearchProvider = ({ children }: { children: ReactNode }) => {
  // The current search terms.
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({});

  // The current applied tags to a given key.
  const [appliedTags, setAppliedTags] = useState<AppliedTags>({});

  // Sets a search term for a given key.
  const setSearchTerm = (tabId: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [tabId]: value }));
  };

  // Sets applioed tags for a given key.
  const applyTags = (tabId: string, tags: string[]) => {
    setAppliedTags((prev) => ({ ...prev, [tabId]: tags }));
  };

  return (
    <ChainSearchContext.Provider
      value={{ searchTerms, setSearchTerm, appliedTags, applyTags }}
    >
      {children}
    </ChainSearchContext.Provider>
  );
};
