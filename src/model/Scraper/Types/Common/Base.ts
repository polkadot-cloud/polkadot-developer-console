// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from 'model/Scraper/Lookup/types';
import { typeToString } from 'model/Scraper/Utils';

export class Base {
  // The raw lookup data of this type.
  lookup: LookupItem;

  // The depth of this type.
  depth: number;

  constructor(lookup: LookupItem, depth: number) {
    this.lookup = lookup;
    this.depth = depth;
  }

  // Get the full path of this type.
  path() {
    const { path, params } = this.lookup.type;
    return typeToString(path, params);
  }

  // Get the label of this type (the last index of the path).
  label() {
    const { path } = this.lookup.type;
    return path[path.length - 1];
  }
}
