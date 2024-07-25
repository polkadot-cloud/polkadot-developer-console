// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { MutableRefObject } from 'react';

export interface UseBrowseListWithKeysProps {
  listItems: string[];
  listOpenRef: MutableRefObject<boolean>;
  activeValue: string | null;
  onUpdate: (newItem: string) => void;
}
