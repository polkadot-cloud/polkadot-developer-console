// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { TagControlsWrapper } from './Wrappers';
import { TagControl } from 'library/TagControl';

export const TagControls = () => (
  <TagControlsWrapper>
    <h5>Tags</h5>
    <div>
      <TagControl name="Add" icon={faPlus} />
      <TagControl name="Clear" />
    </div>
  </TagControlsWrapper>
);
