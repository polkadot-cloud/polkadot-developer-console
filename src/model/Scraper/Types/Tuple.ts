// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MetadataScraper } from '..';
import type { BaseParams, MetadataType, TupleType } from './types';
import type { TrailParam } from '../types';
import { Base } from './Common/Base';

// Class to hold a tuple type.
export class Tuple extends Base implements MetadataType {
  type = 'tuple';

  // The types of this tuple.
  tuple: TupleType;

  constructor(tuple: TupleType, { lookup, depth }: BaseParams) {
    super(lookup, depth);
    this.tuple = tuple;
  }

  // Tuples contain one or more child inputs, therefore no form element is needed here.
  input() {
    return 'indent';
  }

  // Scrape tuple types. Overwrites the type with scraped type at each index.
  scrape(scraper: MetadataScraper, { trailId }: TrailParam) {
    return this.tuple.map((id: number) => scraper.start(id, trailId));
  }
}
