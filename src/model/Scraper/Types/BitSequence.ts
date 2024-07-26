// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { MetadataScraper } from '..';
import type { TypeParams } from '../types';
import type { BaseParams, IBitSequenceType, MetadataType } from './types';
import { Base } from './Common/Base';

// Class to hold a bit sequence type.
export class BitSequenceType extends Base implements MetadataType {
  type = 'bitSequence';

  // The type of this bit sequence.
  bitSequence: IBitSequenceType;

  constructor(bitSequence: IBitSequenceType, base: BaseParams) {
    super(base);
    this.bitSequence = bitSequence;
  }

  // Bit sequences are a sequence of bits, so the input type is always 'Hash'.
  input() {
    return 'Hash';
  }

  // Scrape bitSequence type. Overwrites `bitStoreType` and `bitOrderType` with scraped types.
  scrape(scraper: MetadataScraper, { trailId }: TypeParams) {
    return {
      bitOrderType: scraper.start(this.bitSequence.bitOrderType, {
        parentTrailId: trailId,
        indexKey: `${this.indexKey}_0`,
      }),
      bitStoreType: scraper.start(this.bitSequence.bitStoreType, {
        parentTrailId: trailId,
        indexKey: `${this.indexKey}_1`,
      }),
    };
  }
}
