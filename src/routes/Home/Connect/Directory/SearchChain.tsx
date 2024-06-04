// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SearchInput } from 'library/SearchInput';
import { ChainInputWrapper } from '../Wrappers';
import { TagControls } from './TagControls';
import { useChainFilter } from 'contexts/ChainFilter';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useActiveTab } from 'contexts/ActiveTab';

export const SearchChain = () => {
  const { tabId } = useActiveTab();
  const { getSearchTerm, setSearchTerm } = useChainFilter();

  // The editable value of the input.
  const searchTerm = getSearchTerm(tabId);

  // Handle tab name change.
  const onChange = (value: string) => {
    // If trimmed value and the current value is empty, don't update.
    if (!(!value.trim().length && searchTerm === '')) {
      setSearchTerm(tabId, value);
    }
  };

  return (
    <ChainInputWrapper>
      <SearchInput
        placeholder="Chain Name"
        value={searchTerm}
        onChange={onChange}
        icon={faSearch}
      />
      <TagControls />
    </ChainInputWrapper>
  );
};
