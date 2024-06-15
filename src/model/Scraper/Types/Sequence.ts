// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MetadataScraper } from '..';
import type { BaseParams, MetadataType, SequenceType } from './types';
import type { TrailParam } from '../types';
import { Base } from './Common/Base';
import { sequenceIsBytes } from '../Utils';

// Class to hold a sequence type.
export class Sequence extends Base implements MetadataType {
  type = 'sequence';

  // The type of this sequence.
  innerType: number;

  constructor(sequence: SequenceType, { lookup, depth }: BaseParams) {
    super(lookup, depth);
    this.innerType = sequence.type;
  }

  // Sequences contain one or more child inputs that should be wrapped in an multi-select array
  // input.
  input() {
    let label = this.label();

    // If this sequence is a sequence of bytes, then change the label to `Bytes`.
    if (sequenceIsBytes(label)) {
      label = 'Bytes';
    }

    // If a custom input is not defined, render child inputs.
    return label || 'array';
  }

  // Scrape sequence type. Overwrites `type` with scraped type.
  scrape(scraper: MetadataScraper, trailParam: TrailParam) {
    return scraper.getType(this.innerType, trailParam);
  }
}
