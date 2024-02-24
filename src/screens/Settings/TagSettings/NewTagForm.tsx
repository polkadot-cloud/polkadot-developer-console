// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NewTagWrapper } from './Wrappers';
import { HeaderButtonWrapper } from '../Wrappers';
import { useTags } from 'contexts/Tags';
import type { NewTagFormProps } from './types';

export const NewTagForm = ({
  newTagValue,
  setNewTagValue,
  setNewTagOpen,
}: NewTagFormProps) => {
  const { tags, setTags, getLargesTagId } = useTags();

  // The formatted tag value.
  const formattedTagValue = newTagValue.trim();

  // Check if new tag form is valid.
  const valid = formattedTagValue !== '';

  // Handler to cancel the new tag form.
  const cancelNewTag = () => {
    setNewTagOpen(false);
    setNewTagValue('');
  };

  // Handler to create tag.
  const createTag = () => {
    if (!valid) {
      return;
    }

    setTags({
      ...tags,
      [getLargesTagId() + 1]: {
        name: formattedTagValue,
        locked: false,
      },
    });
    setNewTagOpen(false);
    cancelNewTag();
  };

  return (
    <NewTagWrapper>
      <div className="form">
        <h5>Tag Name</h5>
        <input
          type="text"
          value={newTagValue}
          placeholder="Tag Name"
          onChange={(ev) => setNewTagValue(ev.target.value)}
          maxLength={25}
        />
      </div>
      <div className="controls">
        <span>
          <button className="cancel" onClick={() => cancelNewTag()}>
            Cancel
          </button>
          <HeaderButtonWrapper onClick={() => createTag()} disabled={!valid}>
            Create Tag
          </HeaderButtonWrapper>
        </span>
      </div>
    </NewTagWrapper>
  );
};
