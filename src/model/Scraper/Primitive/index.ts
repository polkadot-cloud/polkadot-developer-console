// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';

// Class to hold a primitive type.
export class Primitive {
  // The raw lookup data of this type.
  lookup: LookupItem;

  // The type of this primitive.
  primitive: string;

  constructor(primitive: string, lookup: LookupItem) {
    this.lookup = lookup;
    this.primitive = primitive;
  }

  // Scrape primitive type. Simply returns the type.
  scrape() {
    return this.primitive;
  }
}
