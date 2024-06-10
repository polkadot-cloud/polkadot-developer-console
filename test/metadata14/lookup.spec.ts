// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import assert from 'assert';
import * as metadataJson from './data/metadataV14.json';

/* Metadata lookup tests.

This test file verifies the structure and integrity of the metadata lookup object.

The goal of this test suit is to document how lookups are structured to the developer. 

TODO: add a test to check if all type of types exist (variant, composite, primitive, bitSequence,
etc. This will probably require tests for the individual types to be in place first. */

describe('Metadata lookup structure is intact', () => {
  const lookup = metadataJson.lookup;
  const lookupTypes = lookup.types;

  it('Lookup exists at metadata top level', () => {
    const keys = Object.keys(metadataJson);
    assert.ok(keys.includes('lookup'));
  });

  it('Lookup only contains `types` field', () => {
    assert.ok('types' in lookup && Object.keys(lookup).length === 1);
  });

  it('Lookup types only contain `id` and `type` fields', () => {
    const result = lookupTypes.every(
      (item) => 'id' in item && 'type' in item && Object.keys(item).length === 2
    );
    assert.ok(result);
  });

  it('Lookup type `id`s are numbers', () => {
    const result = lookupTypes.every((item) => typeof item.id === 'number');
    assert.ok(result);
  });

  it('All lookup types contain the same outer structure', () => {
    assert.ok(
      lookupTypes.every(
        ({ type }) =>
          'path' in type &&
          'params' in type &&
          'def' in type &&
          'docs' in type &&
          Object.keys(type).length === 4
      )
    );
  });

  it('Provided lookup contains 868 types', () => {
    assert.ok(lookupTypes.length === 868);
  });
});
