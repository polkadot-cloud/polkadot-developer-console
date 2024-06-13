// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { TrailId } from '../types';
import type { TupleType } from './types';

// Class to hold a tuple type.
export class Tuple {
  // The raw lookup data of this type.
  lookup: LookupItem;

  // The types of this tuple.
  tuple: TupleType;

  constructor(tuple: TupleType, lookup: LookupItem) {
    this.lookup = lookup;
    this.tuple = tuple;
  }

  // Scrape tuple types. Overwrites the type with scraped type at each index.
  scrape(scraper: MetadataScraper, trailId: TrailId) {
    return this.tuple.map((id: number) => scraper.start(id, trailId));
  }
}
