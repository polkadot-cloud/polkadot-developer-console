// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { TrailParam } from '../types';
import type { CompositeField, CompositeType, MetadataType } from './types';
import { checkCompositeIsBytes, getCustomInput } from '../Utils';
import { Base } from './Common/Base';

// Class to hold a composite type.
export class Composite extends Base implements MetadataType {
  type = 'composite';

  // The fields of this composite.
  fields: CompositeField[];

  constructor(composite: CompositeType, lookup: LookupItem) {
    super(lookup);
    this.fields = composite.fields;
  }

  // Get the input component of this type.
  input() {
    let label = this.label();

    // If this composite is a sequence of u8s, then change the label to `Bytes`.
    if (checkCompositeIsBytes(label, this)) {
      label = 'Bytes';
    }

    // Use a pre-defined custom input if the label matches. NOTE: Custom inputs will ignore the
    // composite type and stop the recursive input loop.
    const customInput = getCustomInput(label);

    // If a custom input is not defined, render child inputs.
    return customInput || 'indent';
  }

  // Scrape composite fields. Overwrites `fields` with scraped fields.
  scrape(scraper: MetadataScraper, { trailId }: TrailParam) {
    return [...this.fields].map((field) => ({
      ...field,
      type: scraper.start(field.type, trailId),
    }));
  }
}
