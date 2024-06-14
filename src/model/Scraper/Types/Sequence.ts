// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { MetadataType, SequenceType } from './types';
import type { TrailParam } from '../types';
import { Base } from './Common/Base';

// Class to hold a sequence type.
export class Sequence extends Base implements MetadataType {
  type = 'sequence';

  // The type of this sequence.
  innerType: number;

  constructor(sequence: SequenceType, lookup: LookupItem) {
    super(lookup);
    this.innerType = sequence.type;
  }

  // Sequences contain one or more child inputs that should be wrapped in an multi-select array
  // input.
  input() {
    return 'array';
  }

  // Scrape sequence type. Overwrites `type` with scraped type.
  scrape(scraper: MetadataScraper, trailParam: TrailParam) {
    return scraper.getType(this.innerType, trailParam);
  }
}
