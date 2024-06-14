// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { IArrayType, MetadataType } from './types';
import type { TrailParam } from '../types';
import { Base } from './Common/Base';

// Class to hold an array type.
export class ArrayType extends Base implements MetadataType {
  type = 'array';

  // The array type and length.
  array: IArrayType;

  constructor(array: IArrayType, lookup: LookupItem) {
    super(lookup);
    this.array = array;
  }

  // Sequences contain one or more child inputs that should be wrapped in an multi-select array
  // input. NOTE: not currently being used. Class needs more context.
  input() {
    return 'array';
  }

  // Scrape array type. Overwrites `type` with scraped type.
  scrape(scraper: MetadataScraper, trailParam: TrailParam) {
    return scraper.getType(this.array.type, trailParam);
  }
}
