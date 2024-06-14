// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { LookupItem } from '../Lookup/types';
import type { MetadataScraper } from '..';
import type { TrailParam } from '../types';
import type { CompositeField, CompositeType, MetadataType } from './types';
import {
  checkCompositeIsBytes,
  getCustomInput,
  getShortLabel,
  typeToString,
} from '../Utils';

// Class to hold a composite type.
export class Composite implements MetadataType {
  type = 'composite';

  // The raw lookup data of this type.
  lookup: LookupItem;

  // The fields of this composite.
  fields: CompositeField[];

  constructor(composite: CompositeType, lookup: LookupItem) {
    this.fields = composite.fields;
    this.lookup = lookup;
  }

  // Get the labels of this composite type.
  label() {
    const { path, params } = this.lookup.type;
    return {
      long: typeToString(path, params),
      short: path[path.length - 1],
    };
  }

  // Get the input component of this type.
  input() {
    let shortLabel = getShortLabel(this.label());

    // If this composite is a sequence of u8s, then change the label to `Bytes`.
    if (checkCompositeIsBytes(shortLabel, this)) {
      shortLabel = 'Bytes';
    }

    // Use a pre-defined custom input if the label matches. NOTE: Custom inputs will ignore the
    // composite type and stop the recursive input loop.
    const customInput = getCustomInput(shortLabel);

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
