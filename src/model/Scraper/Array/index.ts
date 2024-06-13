// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { TrailParam } from '../types';
import type { IArrayType } from './types';

// Class to hold an array type.
export class ArrayType {
  // The raw lookup data of this type.
  lookup: LookupItem;

  // The array type and length.
  array: IArrayType;

  constructor(array: IArrayType, lookup: LookupItem) {
    this.lookup = lookup;
    this.array = array;
  }

  // Scrape array type. Overwrites `type` with scraped type.
  scrape(scraper: MetadataScraper, trailParam: TrailParam) {
    return scraper.getType(this.array.type, trailParam);
  }
}
