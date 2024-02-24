// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TagItem } from 'contexts/Tags/types';

export interface NewTagFormProps {
  newTagValue: string;
  setNewTagValue: (value: string) => void;
  setNewTagOpen: (value: boolean) => void;
}

export interface ManageTagItemProps {
  id: number;
  tag: TagItem;
}
