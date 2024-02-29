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
  const { tags, setTags, getLargestTagCounter } = useTags();

  const formatValue = (str: string): string => {
    // Remove extra spaces.
    str = str.replace(/\s{2,}/g, ' ');
    // Trim.
    str = str.trim();
    return str;
  };

  // Check if tag form is valid.
  const valid = formatValue(value) !== '';

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
          name: formatValue(value),
          locked: false,
          counter,
        },
      });
    } else {
      // Edit existing tag.
      setTags({
        ...tags,
        [`tag_${tagId}`]: {
          ...tags[tagId],
          name: formatValue(value),
        },
      });
      setValue(formatValue(value));
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
