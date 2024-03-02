// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { TagItemWrapper } from './Wrappers';
import { Tag } from 'library/Tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTags } from 'contexts/Tags';
import { SettingsHeaderButton } from '../Wrappers';
import { faLock, faMinus } from '@fortawesome/free-solid-svg-icons';
import type { ManageTagItemProps } from './types';
import { useState } from 'react';
import { ManageTagForm } from './ManageTagForm';
import { useChainFilter } from 'contexts/ChainFilter';

export const MangeTagItem = ({
  id,
  tag: { name, locked },
}: ManageTagItemProps) => {
  const { removeAppliedTag } = useChainFilter();
  const { getChainsForTag, removeTag } = useTags();
  const chainCount = getChainsForTag(id)?.length || 0;

  // The current value of the tag.
  const [editValue, setEditValue] = useState<string>(name);

  // Whether the edit tag form is open.
  const [editTagOpen, setEditTagOpen] = useState<boolean>(false);

  // Handle tag removal. Prompt confirmation before state change.
  const handleRemoveTag = () => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      // Remove the tag from all chain filters.
      removeAppliedTag('*', id);
      // Remove tag from the global tags list.
      removeTag(id);
    }
  };

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
              <SettingsHeaderButton
                onClick={() => setEditTagOpen(!editTagOpen)}
              >
                {editTagOpen && (
                  <FontAwesomeIcon icon={faMinus} transform="shrink-1" />
                )}
                Edit
              </SettingsHeaderButton>
              <SettingsHeaderButton onClick={() => handleRemoveTag()}>
                Delete
              </SettingsHeaderButton>
            </>
          )}
        </div>
      </div>
      {editTagOpen && (
        <ManageTagForm
          tagId={id}
          value={editValue}
          setValue={setEditValue}
          setOpen={setEditTagOpen}
        />
      )}
    </TagItemWrapper>
  );
};
