// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { OwnerId } from 'types';

export interface ApiIndexerContextInterface {
  apiIndexes: ApiIndexes;
  getTabApiIndexes: (ownerId: OwnerId) => ApiIndex[];
  getTabApiIndex: (
    ownerId: OwnerId,
    label: string | undefined
  ) =>
    | (ApiIndex & {
        instanceId: string;
      })
    | undefined;
  setTabApiIndex: (ownerId: OwnerId, index: ApiIndex) => void;
  removeTabApiIndexes: (ownerId: OwnerId) => void;
  removeTabApiIndex: (ownerId: OwnerId, index: number) => void;
}

// A mapping of tab owner ids to their api indexes.
export type ApiIndexes = Record<OwnerId, ApiIndex[]>;

export interface ApiIndex {
  index: number;
  label: string;
}
