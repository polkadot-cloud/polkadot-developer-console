// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { MetadataScraper } from '..';
import type { TypeParams } from '../types';
import type { BaseParams, ICompactType, MetadataType } from './types';
import { Base } from './Common/Base';

// Class to hold a compact type.
export class CompactType extends Base implements MetadataType {
  type = 'compact';

  // The inner type of this compact type.
  innerType: number;

  constructor(compact: ICompactType, base: BaseParams) {
    super(base);
    this.innerType = compact.type;
  }

  // Compact types will just be a compact wrapper of the inner type, so an input is not needed at
  // this level.
  input() {
    return null;
  }

  // Scrape compact type. Overwrites `type` with scraped type.
  scrape(scraper: MetadataScraper, params: TypeParams) {
    const indexKey = `${this.indexKey}_0`;
    return scraper.getType(this.innerType, {
      ...params,
      indexKey,
    });
  }
}
