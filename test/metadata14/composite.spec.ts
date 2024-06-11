// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import assert from 'assert';
import * as metadataJson from './data/metadataV14.json';
import type { AnyJson } from '@w3ux/types';

/* Metadata composite tests.

This test file verifies the structure and integrity of composite types in metadata.

All composites are scraped and run through tests.

The goal of this test suit is to document how composite types are structured to the developer. 

*/

// Basic composite structure.
describe('Basic composite structure is intact', () => {
  const lookup = metadataJson.lookup;
  const lookupTypes = lookup.types;
  const lookupComposite: AnyJson = lookupTypes
    .filter(({ type: { def } }) => 'composite' in def)
    .map((item) => item.type.def.composite);

  // TODO: document composite field structure.
  // const lookupCompositeFields: AnyJson = lookupComposite.map(
  //   ({ fields }: { fields: AnyJson[] }) => fields
  // );

  it('Metadata lookup contains 280 composite types', () => {
    assert.ok(lookupComposite.length === 280);
  });

  it('Composite types only contain one `fields` property', () => {
    lookupComposite.every(
      (item: AnyJson) => 'fields' in item && Object.keys(item).length === 1
    );
  });
});
