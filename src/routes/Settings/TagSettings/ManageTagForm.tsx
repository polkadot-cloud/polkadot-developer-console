// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ManageTagWrapper } from './Wrappers';
import { useTags } from 'contexts/Tags';
import type { ManageTagFormProps } from './types';
import { SettingsHeaderButton } from 'library/Settings/Wrappers';
import { formatInputString } from 'Utils';

export const ManageTagForm = ({
  tagId,
  value,
  setValue,
  setOpen,
}: ManageTagFormProps) => {
  const { tags, setTags, getLargestTagCounter } = useTags();

  // Maximum tag name length.
  const MAX_TAG_NAME_LENGTH = 25;

  // Gets current tag names.
  const tagNames = Object.values(tags).map(({ name }) => name);

  // Check if tag form is valid.
  const valid =
    formatInputString(value) !== '' &&
    formatInputString(value).length <= MAX_TAG_NAME_LENGTH &&
    !tagNames.includes(formatInputString(value));

  // Handler to cancel the tag form.
  const cancel = () => {
    setOpen(false);

    if (!tagId) {
      setValue('');
    } else {
      setValue(tags[tagId].name);
    }
  };

  // Handler to submit tag updates.
  const submit = () => {
    if (!valid) {
      return;
    }

    if (!tagId) {
      const counter = getLargestTagCounter() + 1;

      // Create new tag.
      setTags({
        ...tags,
        [`tag_${counter}`]: {
          name: formatInputString(value),
          locked: false,
          counter,
        },
      });
      setValue('');
    } else {
      // Edit existing tag.
      setTags({
        ...tags,
        [tagId]: {
          ...tags[tagId],
          name: formatInputString(value),
        },
      });
      setValue(formatInputString(value));
    }

    setOpen(false);
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
          maxLength={MAX_TAG_NAME_LENGTH}
          onKeyDown={(ev) => {
            // Submit on enter key.
            if (ev.key === 'Enter') {
              submit();
            }
            // Canel on escape key.
            if (ev.key === 'Escape') {
              cancel();
            }
          }}
        />
      </div>
      <div className="controls">
        <span>
          <button className="cancel" onClick={() => cancel()}>
            Cancel
          </button>
          <SettingsHeaderButton onClick={() => submit()} disabled={!valid}>
            {!tagId ? 'Create Tag' : 'Save Changes'}
          </SettingsHeaderButton>
        </span>
      </div>
    </ManageTagWrapper>
  );
};
