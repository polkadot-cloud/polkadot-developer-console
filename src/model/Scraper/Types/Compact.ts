// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { TrailParam } from '../types';
import type { CompactType, MetadataType } from './types';

// Class to hold a compact type.
export class Compact implements MetadataType {
  // The raw lookup data of this type.
  lookup: LookupItem;

  // The inner type of this compact type.
  type: number;

  constructor(compact: CompactType, lookup: LookupItem) {
    this.lookup = lookup;
    this.type = compact.type;
  }

  // Scrape compact type. Overwrites `type` with scraped type.
  scrape(scraper: MetadataScraper, trailParam: TrailParam) {
    return scraper.getType(this.type, trailParam);
  }
}