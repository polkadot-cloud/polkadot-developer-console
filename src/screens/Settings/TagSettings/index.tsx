// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTags } from 'contexts/Tags';
import { TagItemWrapper } from './Wrappers';
import { Tag } from 'library/Tag';
import {
  HeaderButtonWrapper,
  SettingsHeaderWrapper,
  SettingsSubheadingWrapper,
} from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { NewTagForm } from './NewTagForm';

export const TagSettings = () => {
  const { tags, getChainsForTag, removeTag } = useTags();

  const totalTags = Object.keys(tags).length;

  // The current value of the new tag input.
  const [newTagValue, setNewTagValue] = useState<string>('');

  // Whether the new tag form is open.
  const [newTagOpen, setNewTagOpen] = useState<boolean>(false);

  return (
    <>
      <SettingsHeaderWrapper>
        <h2>Manage Tags</h2>
        <div>
          <HeaderButtonWrapper onClick={() => setNewTagOpen(!newTagOpen)}>
            <FontAwesomeIcon
              icon={newTagOpen ? faMinus : faPlus}
              transform="shrink-1"
            />
            New Tag
          </HeaderButtonWrapper>
        </div>
      </SettingsHeaderWrapper>

      {newTagOpen && (
        <NewTagForm
          newTagValue={newTagValue}
          setNewTagValue={setNewTagValue}
          setNewTagOpen={setNewTagOpen}
        />
      )}

      <SettingsSubheadingWrapper>
        {totalTags} {totalTags === 1 ? 'tag' : 'tags'}
      </SettingsSubheadingWrapper>

      {Object.entries(tags).map(([id, { name, locked }]) => {
        const chainCount = getChainsForTag(Number(id))?.length || 0;

        return (
          <TagItemWrapper key={`tag_${id}`}>
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
                  <HeaderButtonWrapper
                    onClick={() => {
                      /* Do nothing */
                    }}
                  >
                    Edit
                  </HeaderButtonWrapper>
                  <HeaderButtonWrapper onClick={() => removeTag(Number(id))}>
                    Delete
                  </HeaderButtonWrapper>
                </>
              )}
            </div>
          </TagItemWrapper>
        );
      })}
    </>
  );
};
