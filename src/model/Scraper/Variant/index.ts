// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { VariantItem } from './types';
import type { MetadataScraper } from '..';
import type { TrailId } from '../types';

// Class to hold a variant type.
export class Variant {
  // The raw lookup data of this variant.
  lookup: LookupItem;

  // The variants of this variant type.
  items: VariantItem[];

  constructor(variants: VariantItem[], lookup: LookupItem) {
    this.items = variants;
    this.lookup = lookup;
  }

  // Scrape variant fields. Overwrites fields with scraped fields.
  scrape(scraper: MetadataScraper, trailId: TrailId) {
    this.items = [...this.items].map((item) => ({
      ...item,
      fields: item.fields.map((field) => ({
        ...field,
        type: scraper.start(field.type, trailId),
      })),
    }));

    return this.items;
  }
}