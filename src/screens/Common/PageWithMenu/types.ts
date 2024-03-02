// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { PageId } from 'App';
import type { FC } from 'react';

export interface PageWithMenuProps {
  pageId: PageId;
  Page: FC;
  Menu: FC;
}
