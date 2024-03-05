// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainListWrapper, Separator } from './Wrappers';
import type { ChainId } from 'config/networks';
import { NetworkDirectory } from 'config/networks';
import { ChainListItem } from './ChainListItem';
import { useTabs } from 'contexts/Tabs';
import { useChainFilter } from 'contexts/ChainFilter';
import { useTags } from 'contexts/Tags';
import type { TagItem } from 'contexts/Tags/types';

export const ChainList = () => {
  const { activeTabId } = useTabs();
  const { getTagsForChain } = useTags();
  const { getAppliedTags, getSearchTerm } = useChainFilter();

  // NOTE: Currently naively filering simple chain list.

  const results = NetworkDirectory;

  // Filter chains based on applied tags.
  const appliedTags: [ChainId, TagItem][] = getAppliedTags(activeTabId);

  let filtered = Object.fromEntries(
    Object.entries(results).filter(([chain]) =>
      appliedTags.some(([tagId]) =>
        getTagsForChain(chain as ChainId).includes(tagId)
      )
    )
  );

  // Filter chains based on search term.
  const searchTerm = getSearchTerm(activeTabId);

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
          chain={key as ChainId}
          name={name}
        />
      ))}
    </ChainListWrapper>
  );
};
