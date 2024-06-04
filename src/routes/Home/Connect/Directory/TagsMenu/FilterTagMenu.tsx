// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTags } from 'contexts/Tags';
import { useChainFilter } from 'contexts/ChainFilter';
import type { TagId } from 'contexts/Tags/types';
import { useState } from 'react';
import { TagsMenuInner } from './Inner';
import { useActiveTab } from 'contexts/ActiveTab';

export const FilterTagMenu = ({
  onSelect,
}: {
  onSelect: (tagId: TagId, selected: boolean, current: string[]) => void;
}) => {
  const { tags } = useTags();
  const { tabId } = useActiveTab();
  const { getAppliedTags } = useChainFilter();

  const appliedTags = getAppliedTags(tabId);
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
      setTagSearchTerm={setTagSearchTerm}
      handleOnChange={handleOnChange}
      appliedTags={appliedTagIds}
      selectLocked={true}
    />
  );
};
