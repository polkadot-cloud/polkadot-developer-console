// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SearchInput } from 'library/SearchInput';
import { SearchChainWrapper } from './Wrappers';
import { useTabs } from 'contexts/Tabs';
import { useState } from 'react';
import { useEffectIgnoreInitial } from '@polkadot-cloud/react';

export const SearchChain = () => {
  const { activeTabId } = useTabs();

  // The editable value of the input.
  const initialValue = '';
  const [editableValue, setEditableValue] = useState<string>(initialValue);

  // Handle tab name change.
  const onChange = (value: string) => {
    // If trimmed value and the current value is empty, don't update.
    if (!(!value.trim().length && editableValue === '')) {
      setEditableValue(value);
    }
  };
  // Update tab value when active tab changes.
  useEffectIgnoreInitial(() => {
    setEditableValue(initialValue);
  }, [activeTabId, initialValue]);

  return (
    <SearchChainWrapper>
      <SearchInput
        placeholder="Chain Name"
        value={editableValue}
        onChange={onChange}
      />
    </SearchChainWrapper>
  );
};
