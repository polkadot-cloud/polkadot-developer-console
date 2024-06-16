// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MetadataScraper } from '..';
import type { BaseParams, MetadataType, TupleType } from './types';
import type { TypeParams } from '../types';
import { Base } from './Common/Base';

// Class to hold a tuple type.
export class Tuple extends Base implements MetadataType {
  type = 'tuple';

  // The types of this tuple.
  tuple: TupleType;

  constructor(tuple: TupleType, base: BaseParams) {
    super(base);
    this.tuple = tuple;
  }

  // Tuples contain one or more child inputs, therefore no form element is needed here.
  input() {
    return 'indent';
  }

  // Scrape tuple types. Overwrites the type with scraped type at each index.
  scrape(scraper: MetadataScraper, { trailId }: TypeParams) {
    return this.tuple.map((id: number, index) => {
      const inputKey = `${this.inputKey}_${index}`;

      return scraper.start(id, { parentTrailId: trailId, inputKey });
    });
  }
}
