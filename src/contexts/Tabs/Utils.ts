// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { OwnerId } from 'model/Api/types';

// Converts a tabId into an owner id. This is currently just converting the tab id to a string.
export const tabIdToOwnerId = (tabId: number): OwnerId =>
  String(`tab_${tabId}`);

// Converts an `ownerId` to a tab id. This is currently just converting the owner id to a number.
export const ownerIdToTabId = (ownerId: OwnerId): number => {
  const result = ownerId.split(/_(.*)/s);
  return Number(result[1]) || 0;
};
