// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { CompositeField, CompositeType } from './types';
import type { MetadataScraper } from '..';
import type { TrailId } from '../types';

// Class to hold a composite type.
export class Composite {
  // The raw lookup data of this type.
  lookup: LookupItem;

  // The fields of this composite.
  fields: CompositeField[];

  constructor(composite: CompositeType, lookup: LookupItem) {
    this.fields = composite.fields;
    this.lookup = lookup;
  }

  // Scrape composite fields. Overwrites `fields` with scraped fields.
  scrape(scraper: MetadataScraper, trailId: TrailId) {
    this.fields = [...this.fields].map((field) => ({
      ...field,
      type: scraper.start(field.type, trailId),
    }));

    return this.fields;
  }
}
