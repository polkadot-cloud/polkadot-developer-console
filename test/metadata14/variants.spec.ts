// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import assert from 'assert';
import * as metadataJson from './data/metadataV14.json';
import type { AnyJson } from '@w3ux/types';

/* Metadata variants tests.

This test file verifies the structure and integrity of variants in metadata.

All variants are scraped and run through tests. Beyond the basic variant structure, the types
variants hold are also tested to document the correct structure, e.g. a variants of tuples,
composites, or enums.

The goal of this test suit is to document how variants are structured to the developer. */

// Basic variant structure.
describe('Basic variant structure is intact', () => {
  const lookup = metadataJson.lookup;
  const lookupTypes = lookup.types;
  const lookupVariants: AnyJson = lookupTypes
    .filter(({ type: { def } }) => 'variant' in def)
    .map((item) => item.type.def.variant);

  const variantDefs = lookupVariants.map((item: AnyJson) => item.variants);

  it('Metadata lookup contains 318 variants', () => {
    assert.ok(lookupVariants.length === 318);
  });

  it('Variants only contain one `variants` property', () => {
    lookupVariants.every(
      (item: AnyJson) => 'variants' in item && Object.keys(item).length === 1
    );
  });

  it('All variants contain the same array of properties', () => {
    const result = variantDefs.every((item: AnyJson) => {
      if (!Array.isArray(item)) {
        return false;
      }
      for (const variantItem of item) {
        if (
          !(
            'name' in variantItem &&
            'fields' in variantItem &&
            'index' in variantItem &&
            'docs' in variantItem
          )
        ) {
          return false;
        }
      }
      return true;
    });

    assert.ok(result);
  });

  // variants with no fields are simple enums.
  // variants with fields are typed enums.
  // fields -> [docs, name, type, typeName].

  assert.equal(1, 1);
});
