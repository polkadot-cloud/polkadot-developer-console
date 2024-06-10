// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';

export interface MetadataLookup {
  types: LookupTypes;
}

export type LookupTypes = LookupType[];

export interface LookupType {
  id: number;
  type: AnyJson;
}
