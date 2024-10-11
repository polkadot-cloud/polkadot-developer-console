// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { MetadataLookup } from './types';

// Class to hold metadata lookup, with type accessors.
export class Lookup {
  lookup: MetadataLookup;

  constructor(lookup: MetadataLookup) {
    this.lookup = lookup;
  }

  // Get types array from lookup.
  types() {
    return this.lookup.types;
  }

  // Get a type record from lookup types, or undefined otherwise.
  getType(typeId: number) {
    return this.types().find(({ id }: { id: number }) => id === typeId);
  }
}
