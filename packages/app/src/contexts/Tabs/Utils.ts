// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { OwnerId } from 'types';

// Converts a tabId into an owner id.
export const tabIdToOwnerId = (tabId: number): OwnerId =>
  String(`tab_${tabId}`);

// Converts an `ownerId` to a tab id. This takes the first number in the string, before the first
// underscore.
export const ownerIdToTabId = (ownerId: OwnerId): number => {
  const result = ownerId.split('_');
  return Number(result[1]) || 0;
};
