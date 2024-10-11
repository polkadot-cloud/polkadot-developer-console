// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AnyJson } from '@w3ux/types';

export interface MetadataLookup {
  types: LookupTypes;
}

export type LookupTypes = LookupItem[];

export interface LookupItem {
  id: number;
  type: LookupType;
}

export interface LookupType {
  path: string[];
  params: AnyJson[];
  def: AnyJson;
  docs: string[];
}
