// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { tabIdToOwnerId } from 'contexts/Tabs/Utils';
import type { ActiveTabContextInterface } from './types';

export const defaultActiveTabContext: ActiveTabContextInterface = {
  tabId: 0,
  ownerId: tabIdToOwnerId(0),
  tab: undefined,
};
