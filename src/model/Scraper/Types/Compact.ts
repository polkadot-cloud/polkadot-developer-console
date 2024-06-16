// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MetadataScraper } from '..';
import type { TypeParams } from '../types';
import type { BaseParams, CompactType, MetadataType } from './types';
import { Base } from './Common/Base';

// Class to hold a compact type.
export class Compact extends Base implements MetadataType {
  type = 'compact';

  // The inner type of this compact type.
  innerType: number;

  constructor(compact: CompactType, base: BaseParams) {
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
    return scraper.getType(this.innerType, {
      ...params,
      inputKey: `${this.inputKey}_0`,
    });
  }
}
