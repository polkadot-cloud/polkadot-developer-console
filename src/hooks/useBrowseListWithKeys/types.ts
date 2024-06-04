// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MutableRefObject } from 'react';

export interface UseBrowseListWithKeysProps {
  listItems: string[];
  listOpenRef: MutableRefObject<boolean>;
  activeValue: string | null;
  onUpdate: (newItem: string) => void;
}
