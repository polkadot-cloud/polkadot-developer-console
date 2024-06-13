// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { MetadataType, TupleType } from './types';
import type { TrailParam } from '../types';

// Class to hold a tuple type.
export class Tuple implements MetadataType {
  type = 'tuple';

  // The raw lookup data of this type.
  lookup: LookupItem;

  // The types of this tuple.
  tuple: TupleType;

  constructor(tuple: TupleType, lookup: LookupItem) {
    this.lookup = lookup;
    this.tuple = tuple;
  }

  label() {
    return '';
  }

  // TODO: implement input.
  input() {
    return 'todo';
  }

  // Scrape tuple types. Overwrites the type with scraped type at each index.
  scrape(scraper: MetadataScraper, { trailId }: TrailParam) {
    return this.tuple.map((id: number) => scraper.start(id, trailId));
  }
}
