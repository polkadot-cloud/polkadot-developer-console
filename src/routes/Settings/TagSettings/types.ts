// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TagId, TagItem } from 'contexts/Tags/types';

export interface ManageTagFormProps {
  tagId?: TagId;
  value: string;
  setValue: (value: string) => void;
  setOpen: (value: boolean) => void;
}

export interface ManageTagItemProps {
  id: string;
  tag: TagItem;
}
