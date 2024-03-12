// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTags } from 'contexts/Tags';
import { useTabs } from 'contexts/Tabs';
import { useChainFilter } from 'contexts/ChainFilter';
import type { TagId } from 'contexts/Tags/types';
import { useState } from 'react';
import { TagsMenuInner } from './Inner';

export const FilterTagMenu = ({
  onSelect,
}: {
  onSelect: (tagId: TagId, selected: boolean, current: string[]) => void;
}) => {
  const { tags } = useTags();
  const { activeTabId } = useTabs();
  const { getAppliedTags } = useChainFilter();

  const appliedTags = getAppliedTags(activeTabId);
  const appliedTagIds = appliedTags.map(([id]) => id);

  // The tag search term.
  const [tagSearchTerm, setTagSearchTerm] = useState<string>('');

  // Handle tag search change.
  const handleOnChange = (value: string) => {
    setTagSearchTerm(value);
  };

  return (
    <TagsMenuInner
      tagEntries={Object.entries(tags)}
      onSelect={onSelect}
      tagSearchTerm={tagSearchTerm}
      handleOnChange={handleOnChange}
      appliedTags={appliedTagIds}
      selectLocked={true}
    />
  );
};
