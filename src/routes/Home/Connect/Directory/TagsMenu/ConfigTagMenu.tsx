// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTags } from 'contexts/Tags';
import type { DirectoryId } from 'config/networks/types';
import type { TagId } from 'contexts/Tags/types';
import { useState } from 'react';
import { TagsMenuInner } from './Inner';

export const ConfigTagMenu = ({
  onSelect,
  chainId,
}: {
  onSelect: (tagId: TagId, selected: boolean, current?: string[]) => void;
  chainId: DirectoryId;
}) => {
  const { tags, getTagsForChain } = useTags();

  // The tag search term.
  const [tagSearchTerm, setTagSearchTerm] = useState<string>('');

  const appliedTags = getTagsForChain(chainId);

  // Re-order tags so locked tags appear last.
  const orderedEntries = Object.entries(tags).sort(
    ([, a], [, b]) => Number(a.locked) - Number(b.locked)
  );

  // Handle tag search change.
  const handleOnChange = (value: string) => {
    setTagSearchTerm(value);
  };

  return (
    <TagsMenuInner
      tagEntries={orderedEntries}
      appliedTags={appliedTags}
      tagSearchTerm={tagSearchTerm}
      setTagSearchTerm={setTagSearchTerm}
      onSelect={onSelect}
      handleOnChange={handleOnChange}
      selectLocked={false}
    />
  );
};
