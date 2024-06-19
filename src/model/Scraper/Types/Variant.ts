// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MetadataScraper } from '..';
import type { BaseParams, MetadataType, IVariantItem } from './types';
import type { TypeParams } from '../types';
import { Base } from './Common/Base';

// Class to hold a variant type.
export class VariantType extends Base implements MetadataType {
  type = 'variant';

  // The variants of this variant type.
  items: IVariantItem[];

  constructor(variants: IVariantItem[], base: BaseParams) {
    super(base);
    this.items = variants;
  }

  // Variants (enums) are themselves a multi-select input, that then effect child inputs.
  input() {
    return 'select';
  }

  // Scrape variant fields. Overwrites `fields` with scraped fields.
  scrape(scraper: MetadataScraper, { trailId }: TypeParams) {
    return [...this.items].map(({ index, name, fields }, i) => {
      const itemKey = `${this.indexKey}_${i}`;

      return {
        index,
        name,
        fields: fields.map(({ type, name: fieldName, typeName }, j) => {
          const indexKey = `${itemKey}_${j}`;

          return {
            name: fieldName,
            typeName,
            ...scraper.start(type, { parentTrailId: trailId, indexKey }),
          };
        }),
      };
    });
  }
}
