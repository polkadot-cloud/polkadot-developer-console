// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTags } from 'contexts/Tags';
import { TagItemWrapper } from './Wrappers';

export const TagSettings = () => {
  const { tags } = useTags();
  return (
    <>
      <h2>Manage Tags</h2>

      {Object.entries(tags).map(([id, name]) => (
        <TagItemWrapper key={`tag_${id}`}>
          <span>{name}</span>
          <button>Edit</button>
        </TagItemWrapper>
      ))}
    </>
  );
};
