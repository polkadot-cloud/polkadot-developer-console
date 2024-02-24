// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TagItemWrapper } from './Wrappers';
import { Tag } from 'library/Tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTags } from 'contexts/Tags';
import { HeaderButtonWrapper } from '../Wrappers';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import type { ManageTagItemProps } from './types';
import { useState } from 'react';
import { ManageTagForm } from './ManageTagForm';

export const MangeTagItem = ({
  id,
  tag: { name, locked },
}: ManageTagItemProps) => {
  const { getChainsForTag, removeTag } = useTags();
  const chainCount = getChainsForTag(Number(id))?.length || 0;

  // The current value of the tag.
  const [editValue, setEditValue] = useState<string>(name);

  // Whether the edit tag form is open.
  const [editTagOpen, setEditTagOpen] = useState<boolean>(false);

  return (
    <TagItemWrapper key={`tag_${id}`}>
      <div className="inner">
        <div className="details">
          <span className="tag">
            <Tag name={name} large />
          </span>
          <h5>
            Applied to {chainCount} {chainCount === 1 ? 'chain' : 'chains'}
          </h5>
        </div>
        <div className="controls">
          {locked && (
            <FontAwesomeIcon
              icon={faLock}
              transform="shrink-4"
              className="lock"
            />
          )}
          {!locked && (
            <>
              <HeaderButtonWrapper onClick={() => setEditTagOpen(!editTagOpen)}>
                Edit
              </HeaderButtonWrapper>
              <HeaderButtonWrapper onClick={() => removeTag(Number(id))}>
                Delete
              </HeaderButtonWrapper>
            </>
          )}
        </div>
      </div>
      {editTagOpen && (
        <ManageTagForm
          tagId={Number(id)}
          value={editValue}
          setValue={setEditValue}
          setOpen={setEditTagOpen}
        />
      )}
    </TagItemWrapper>
  );
};
