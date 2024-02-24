// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTags } from 'contexts/Tags';
import { NewTagWrapper, TagItemWrapper } from './Wrappers';
import { Tag } from 'library/Tag';
import {
  HeaderButtonWrapper,
  SettingsHeaderWrapper,
  SettingsSubheadingWrapper,
} from '../Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export const TagSettings = () => {
  const { tags, getChainsForTag } = useTags();
  const totalTags = Object.keys(tags).length;

  // Whether the new tag form is open.
  const [newTagOpen, setNewTagOpen] = useState<boolean>(false);

  // The current value of the new tag input.
  const [newTagValue, setNewTagValue] = useState<string>('');

  // Handler to cancel the new tag form.
  const cancelNewTag = () => {
    setNewTagOpen(false);
    setNewTagValue('');
  };

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
        <NewTagWrapper>
          <div className="input">
            <input
              type="text"
              value={newTagValue}
              placeholder="Tag Name"
              onChange={(ev) => setNewTagValue(ev.target.value)}
            />
          </div>
          <div className="controls">
            <button className="cancel" onClick={() => cancelNewTag()}>
              Cancel
            </button>
            <HeaderButtonWrapper onClick={() => setNewTagOpen(!newTagOpen)}>
              Create Tag
            </HeaderButtonWrapper>
          </div>
        </NewTagWrapper>
      )}

      <SettingsSubheadingWrapper>
        {totalTags} {totalTags === 1 ? 'tag' : 'tags'}
      </SettingsSubheadingWrapper>

      {Object.entries(tags).map(([id, { name, locked }]) => {
        const chainCount = getChainsForTag(Number(id)).length;

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
              {!locked && <button disabled={locked}>Edit</button>}
            </div>
          </TagItemWrapper>
        );
      })}
    </>
  );
};
