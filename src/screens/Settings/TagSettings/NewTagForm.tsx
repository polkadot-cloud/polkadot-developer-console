// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, SetStateAction } from 'react';
import { NewTagWrapper } from './Wrappers';
import { HeaderButtonWrapper } from '../Wrappers';

export const NewTagForm = ({
  newTagValue,
  setNewTagValue,
  newTagOpen,
  setNewTagOpen,
}: {
  newTagValue: string;
  setNewTagValue: Dispatch<SetStateAction<string>>;
  newTagOpen: boolean;
  setNewTagOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  // Handler to cancel the new tag form.
  const cancelNewTag = () => {
    setNewTagOpen(false);
    setNewTagValue('');
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
        />
      </div>
      <div className="controls">
        <span>
          <button className="cancel" onClick={() => cancelNewTag()}>
            Cancel
          </button>
          <HeaderButtonWrapper onClick={() => setNewTagOpen(!newTagOpen)}>
            Create Tag
          </HeaderButtonWrapper>
        </span>
      </div>
    </NewTagWrapper>
  );
};
