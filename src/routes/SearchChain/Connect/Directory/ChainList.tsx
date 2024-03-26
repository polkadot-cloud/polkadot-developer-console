// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainListWrapper, Separator } from '../Wrappers';
import type { DirectoryId } from 'config/networks';
import { NetworkDirectory } from 'config/networks';
import { ChainListItem } from './ChainListItem';
import { useTabs } from 'contexts/Tabs';
import { useChainFilter } from 'contexts/ChainFilter';
import { useTags } from 'contexts/Tags';
import type { TagItem } from 'contexts/Tags/types';
import { useActiveTabId } from 'contexts/RenderedTab';

export const ChainList = () => {
  const { getTagsForChain } = useTags();
  const activeTabId = useActiveTabId();
  const { getStoredChain } = useTabs();
  const { getAppliedTags, getSearchTerm } = useChainFilter();
  const tabStoredChain = getStoredChain(activeTabId);

  // NOTE: Currently naively filtering simple chain list.

  const results = NetworkDirectory;

  // Filter chains based on applied tags.
  const appliedTags: [DirectoryId, TagItem][] = getAppliedTags(activeTabId);

  let filtered = appliedTags.length
    ? Object.fromEntries(
        Object.entries(results).filter(([chain]) =>
          appliedTags.every(([tagId]) =>
            getTagsForChain(chain as DirectoryId).includes(tagId)
          )
        )
      )
    : results;

  // Filter chains based on search term.
  const searchTerm = getSearchTerm(activeTabId);

  // Remove the currently stored chain from results if it exists.
  if (tabStoredChain) {
    filtered = Object.fromEntries(
      Object.entries(filtered).filter(([key]) => key !== tabStoredChain.id)
    );
  }

  if (searchTerm !== '') {
    filtered = Object.fromEntries(
      Object.entries(filtered).filter(([, { name }]) =>
        name.includes(searchTerm)
      )
    );
  }

  // Get the total resulting chains.
  const totalResults = Object.keys(filtered).length;

  return (
    <ChainListWrapper>
      <Separator />
      <h4>
        {totalResults || 'No'} {totalResults === 1 ? 'Chain' : 'Chains'} Found
      </h4>

      {Object.entries(filtered).map(([key, { name }]) => (
        <ChainListItem
          key={`chain_index_${key}`}
          chainId={key as DirectoryId}
          name={name}
        />
      ))}
    </ChainListWrapper>
  );
};
