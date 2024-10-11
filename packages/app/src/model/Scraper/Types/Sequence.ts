// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { MetadataScraper } from '..';
import type { BaseParams, MetadataType, ISequenceType } from './types';
import type { TypeParams } from '../types';
import { Base } from './Common/Base';
import { sequenceIsBytes } from '../Utils';

// Class to hold a sequence type.
export class SequenceType extends Base implements MetadataType {
  type = 'sequence';

  // The type of this sequence.
  innerType: number;

  constructor(sequence: ISequenceType, base: BaseParams) {
    super(base);
    this.innerType = sequence.type;
  }

  // Sequences contain one or more child inputs that should be wrapped in an multi-select array
  // input.
  input() {
    let label = this.label;

    // If this sequence is a sequence of bytes, then change the label to `Bytes`.
    if (sequenceIsBytes(label)) {
      label = 'Bytes';
    }

    // If a custom input is not defined, render child inputs.
    return label || 'array';
  }

  // Scrape sequence type. Overwrites `type` with scraped type.
  scrape(scraper: MetadataScraper, params: TypeParams) {
    const indexKey = `${this.indexKey}_0`;
    return scraper.getType(this.innerType, {
      ...params,
      indexKey,
    });
  }
}
