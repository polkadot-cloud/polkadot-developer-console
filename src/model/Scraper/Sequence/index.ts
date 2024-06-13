// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { TrailParam } from '../types';
import type { SequenceType } from './types';

// Class to hold a sequence type.
export class Sequence {
  // The raw lookup data of this type.
  lookup: LookupItem;

  // The type of this sequence.
  type: number;

  constructor(sequence: SequenceType, lookup: LookupItem) {
    this.lookup = lookup;
    this.type = sequence.type;
  }

  // Scrape sequence type. Overwrites `type` with scraped type.
  scrape(scraper: MetadataScraper, trailParam: TrailParam) {
    return scraper.getType(this.type, trailParam);
  }
}
