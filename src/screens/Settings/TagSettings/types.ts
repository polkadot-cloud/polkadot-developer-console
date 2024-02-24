// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TagItem } from 'contexts/Tags/types';

export interface ManageTagFormProps {
  tagId?: number;
  value: string;
  setValue: (value: string) => void;
  setOpen: (value: boolean) => void;
}

export interface ManageTagItemProps {
  id: number;
  tag: TagItem;
}
