// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { MetadataType, VariantItem } from './types';
import type { TrailParam } from '../types';
import { Format } from '../Format';

// Class to hold a variant type.
export class Variant implements MetadataType {
  // The raw lookup data of this type.
  lookup: LookupItem;

  // The variants of this variant type.
  items: VariantItem[];

  constructor(variants: VariantItem[], lookup: LookupItem) {
    this.items = variants;
    this.lookup = lookup;
  }

  // Get the labels of this variant.
  labels() {
    const { path, params } = this.lookup.type;
    return {
      long: Format.typeToString(path, params),
      short: path[path.length - 1],
    };
  }

  // Scrape variant fields. Overwrites `fields` with scraped fields.
  scrape(scraper: MetadataScraper, { trailId }: TrailParam) {
    return [...this.items].map((item) => ({
      ...item,
      fields: item.fields.map((field) => ({
        ...field,
        type: scraper.start(field.type, trailId),
      })),
    }));
  }
}
