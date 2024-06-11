// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { VariantItem } from './types';
import type { MetadataScraper } from '..';
import type { TrailId } from '../types';

// Class to hold a variant, with type accessors.
export class Variant {
  // The raw lookup data of this variant.
  lookup: LookupItem;

  // The variants of this variant type.
  items: VariantItem[];

  constructor(variants: VariantItem[], lookup: LookupItem) {
    this.items = variants;
    this.lookup = lookup;
  }

  // Get variant item by index.
  getItem(index: number) {
    return this.items.find((item) => item.index === index);
  }

  // Gets a variant item name by index.
  getName(index: number) {
    const item = this.getItem(index);
    return item ? item.name : null;
  }

  // Get variant item fields by index.
  getFields(index: number) {
    const item = this.getItem(index);
    return item ? item.fields : [];
  }

  // Scrape variant fields. Overwrites fields with scraped fields.
  scrape(scraper: MetadataScraper, trailId: TrailId) {
    this.items = [...this.items].map((item) => ({
      ...item,
      fields: item.fields.map(({ docs, name, type, typeName }) => ({
        docs,
        name,
        typeName,
        type: scraper.start(type, trailId),
      })),
    }));

    return this.items;
  }
}
