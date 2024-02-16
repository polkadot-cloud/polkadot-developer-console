// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@polkadot-cloud/react';
import { useTabs } from 'contexts/Tabs';
import { TextInput } from 'library/TextInput';
import { useState } from 'react';

export const RenameTab = () => {
  const { activeTabId, getActiveTab, renameTab } = useTabs();

  // The editable value of the input.
  const initialValue = getActiveTab()?.name || '';
  const [editableValue, setEditableValue] = useState<string>(initialValue);

  // Handle tab name form submission.
  const onSubmit = (value: string) => {
    if (value) {
      setEditableValue(value);
      renameTab(activeTabId, value);
    }
  };

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
  }, [activeTabId]);

  return (
    <TextInput
      name="tab_name"
      value={editableValue}
      placeholder="Tab Name"
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
};
