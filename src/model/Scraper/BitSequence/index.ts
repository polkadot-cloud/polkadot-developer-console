// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { BitSequenceType } from './types';
import type { TrailId } from '../types';

// Class to hold a sequence type.
export class BitSequence {
  // The raw lookup data of this type.
  lookup: LookupItem;

  // The type of this sequence.
  bitSequence: BitSequenceType;

  constructor(bitSequence: BitSequenceType, lookup: LookupItem) {
    this.lookup = lookup;
    this.bitSequence = bitSequence;
  }

  // Scrape bitSequence type. Overwrites `bitStoreType` and `bitOrderType` with scraped types.
  scrape(scraper: MetadataScraper, trailId: TrailId) {
    return {
      bitOrderType: scraper.start(this.bitSequence.bitOrderType, trailId),
      bitStoreType: scraper.start(this.bitSequence.bitStoreType, trailId),
    };
  }
}
