// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { TrailParam } from '../types';
import type { BitSequenceType, MetadataType } from './types';
import { typeToString } from '../Format/Utils';

// Class to hold a bit sequence type.
export class BitSequence implements MetadataType {
  type = 'bitSequence';

  // The raw lookup data of this type.
  lookup: LookupItem;

  // The type of this bit sequence.
  bitSequence: BitSequenceType;

  constructor(bitSequence: BitSequenceType, lookup: LookupItem) {
    this.lookup = lookup;
    this.bitSequence = bitSequence;
  }

  // Get the labels of this bit sequence.
  label() {
    const { path, params } = this.lookup.type;
    return {
      long: typeToString(path, params),
      short: path[path.length - 1],
    };
  }

  // Scrape bitSequence type. Overwrites `bitStoreType` and `bitOrderType` with scraped types.
  scrape(scraper: MetadataScraper, { trailId }: TrailParam) {
    return {
      bitOrderType: scraper.start(this.bitSequence.bitOrderType, trailId),
      bitStoreType: scraper.start(this.bitSequence.bitStoreType, trailId),
    };
  }
}
