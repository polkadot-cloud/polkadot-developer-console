// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { MetadataType, SequenceType } from './types';
import type { TrailParam } from '../types';

// Class to hold a sequence type.
export class Sequence implements MetadataType {
  type = 'sequence';

  // The raw lookup data of this type.
  lookup: LookupItem;

  // The type of this sequence.
  innerType: number;

  constructor(sequence: SequenceType, lookup: LookupItem) {
    this.lookup = lookup;
    this.innerType = sequence.type;
  }

  label() {
    return '';
  }

  // Scrape sequence type. Overwrites `type` with scraped type.
  scrape(scraper: MetadataScraper, trailParam: TrailParam) {
    return scraper.getType(this.innerType, trailParam);
  }
}
