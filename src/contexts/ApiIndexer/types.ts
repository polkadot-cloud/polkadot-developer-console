// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { OwnerId } from 'types';

// The currently accepted api index labels.
export type ApiIndexLabel = 'chainExplorer' | 'parachainSetup';

export interface ApiIndexerContextInterface {
  apiIndexes: ApiIndexes;
  getTabApiIndexes: (ownerId: OwnerId) => ApiIndex[];
  getTabApiIndex: (
    ownerId: OwnerId,
    label: ApiIndexLabel | undefined
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

// An api index, which includes the index and a label.
export interface ApiIndex {
  index: number;
  label: ApiIndexLabel;
}
