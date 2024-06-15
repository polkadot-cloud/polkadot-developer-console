// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MetadataScraper } from '..';
import type { TrailParam } from '../types';
import type { BaseParams, BitSequenceType, MetadataType } from './types';
import { Base } from './Common/Base';

// Class to hold a bit sequence type.
export class BitSequence extends Base implements MetadataType {
  type = 'bitSequence';

  // The type of this bit sequence.
  bitSequence: BitSequenceType;

  constructor(bitSequence: BitSequenceType, base: BaseParams) {
    super(base);
    this.bitSequence = bitSequence;
  }

  // Bit sequences are a sequence of bits, so the input type is always 'Hash'.
  input() {
    return 'Hash';
  }

  // Scrape bitSequence type. Overwrites `bitStoreType` and `bitOrderType` with scraped types.
  scrape(scraper: MetadataScraper, { trailId }: TrailParam) {
    return {
      bitOrderType: scraper.start(this.bitSequence.bitOrderType, trailId),
      bitStoreType: scraper.start(this.bitSequence.bitStoreType, trailId),
    };
  }
}
