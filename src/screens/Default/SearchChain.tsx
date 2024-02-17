// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SearchInput } from 'library/SearchInput';
import { SearchChainWrapper } from './Wrappers';
import { useTabs } from 'contexts/Tabs';
import { TagControls } from './TagControls';
import { useChainSearch } from 'contexts/ChainSearch';

export const SearchChain = () => {
  const { activeTabId } = useTabs();
  const { getSearchTerm, setSearchTerm } = useChainSearch();

  // The editable value of the input.
  const searchTerm = getSearchTerm(activeTabId);

  // Handle tab name change.
  const onChange = (value: string) => {
    // If trimmed value and the current value is empty, don't update.
    if (!(!value.trim().length && searchTerm === '')) {
      setSearchTerm(activeTabId, value);
    }
  };

  return (
    <SearchChainWrapper>
      <SearchInput
        placeholder="Chain Name"
        value={searchTerm}
        onChange={onChange}
      />
      <TagControls />
    </SearchChainWrapper>
  );
};
