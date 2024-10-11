// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { MetadataScraper } from '..';
import type { TypeParams } from '../types';
import type {
  BaseParams,
  ICompositeField,
  ICompositeType,
  MetadataType,
} from './types';
import { compositeIsBytes, getCustomInput } from '../Utils';
import { Base } from './Common/Base';

// Class to hold a composite type.
export class CompositeType extends Base implements MetadataType {
  type = 'composite';

  // The fields of this composite.
  fields: ICompositeField[];

  constructor(composite: ICompositeType, base: BaseParams) {
    super(base);
    this.fields = composite.fields;
  }

  // Get the input component of this type.
  input() {
    let label = this.label;

    // If this composite is a sequence of u8s, then change the label to `Bytes`.
    if (compositeIsBytes(label, this)) {
      label = 'Bytes';
    }

    // Use a pre-defined custom input if the label matches. NOTE: Custom inputs will ignore the
    // composite type and stop the recursive input loop.
    const customInput = getCustomInput(label);

    // If a custom input is not defined, render child inputs.
    return customInput || 'indent';
  }

  // Scrape composite fields. Overwrites `fields` with scraped fields.
  scrape(scraper: MetadataScraper, { trailId }: TypeParams) {
    return [...this.fields].map(({ type, name, typeName }, index) => {
      const indexKey = `${this.indexKey}_${index}`;

      let result = {
        name,
        typeName,
      };

      // If this field is a known custom type, do not scrape child types. Otherwise, continue.
      if (this.input() === 'indent') {
        result = {
          ...result,
          ...scraper.start(type, {
            parentTrailId: trailId,
            indexKey,
          }),
        };
      }

      return result;
    });
  }
}
