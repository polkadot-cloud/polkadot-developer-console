// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MetadataScraper } from '..';
import type { BaseParams, MetadataType, VariantItem } from './types';
import type { TypeParams } from '../types';
import { Base } from './Common/Base';

// Class to hold a variant type.
export class Variant extends Base implements MetadataType {
  type = 'variant';

  // The variants of this variant type.
  items: VariantItem[];

  constructor(variants: VariantItem[], base: BaseParams) {
    super(base);
    this.items = variants;
  }

  // Variants (enums) are themselves a multi-select input, that then effect child inputs.
  input() {
    return 'select';
  }

  // Scrape variant fields. Overwrites `fields` with scraped fields.
  scrape(scraper: MetadataScraper, { trailId }: TypeParams) {
    return [...this.items].map((item) => ({
      ...item,
      fields: item.fields.map((field) => ({
        ...field,
        type: scraper.start(field.type, { parentTrailId: trailId }),
      })),
    }));
  }
}
