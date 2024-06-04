// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Tab } from 'contexts/Tabs/types';
import type { OwnerId } from 'types';

export interface ActiveTabContextInterface {
  tabId: number;
  ownerId: OwnerId;
  tab: Tab | undefined;
}
