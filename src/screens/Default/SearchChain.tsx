// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SearchInput } from 'library/SearchInput';
import { SearchChainWrapper } from './Wrappers';
import { useTabs } from 'contexts/Tabs';
import { TagControls } from './TagControls';
import { useChainFilter } from 'contexts/ChainFilter';

export const SearchChain = () => {
  const { activeTabId } = useTabs();
  const { getSearchTerm, setSearchTerm } = useChainFilter();

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
