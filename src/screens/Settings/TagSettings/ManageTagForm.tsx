// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ManageTagWrapper } from './Wrappers';
import { HeaderButtonWrapper } from '../Wrappers';
import { useTags } from 'contexts/Tags';
import type { ManageTagFormProps } from './types';

export const ManageTagForm = ({
  tagId,
  value,
  setValue,
  setOpen,
}: ManageTagFormProps) => {
  const { tags, setTags, getLargesTagId } = useTags();

  // The formatted tag value.
  const formattedTagValue = value.trim();

  // Check if tag form is valid.
  const valid = formattedTagValue !== '';

  // Handler to cancel the tag form.
  const cancel = () => {
    setOpen(false);

    if (!tagId) {
      setValue('');
    }
  };

  // Handler to submit tag updates.
  const submit = () => {
    if (!valid) {
      return;
    }

    if (!tagId) {
      // Create new tag.
      setTags({
        ...tags,
        [getLargesTagId() + 1]: {
          name: formattedTagValue,
          locked: false,
        },
      });
    } else {
      // Edit existing tag.
      setTags({
        ...tags,
        [tagId]: {
          ...tags[tagId],
          name: formattedTagValue,
        },
      });
    }

    cancel();
  };

  return (
    <ManageTagWrapper>
      <div className="form">
        <h5>Tag Name</h5>
        <input
          type="text"
          value={value}
          placeholder="Tag Name"
          onChange={(ev) => setValue(ev.target.value)}
          maxLength={25}
        />
      </div>
      <div className="controls">
        <span>
          <button className="cancel" onClick={() => cancel()}>
            Cancel
          </button>
          <HeaderButtonWrapper onClick={() => submit()} disabled={!valid}>
            {!tagId ? 'Create Tag' : 'Save Changes'}
          </HeaderButtonWrapper>
        </span>
      </div>
    </ManageTagWrapper>
  );
};
