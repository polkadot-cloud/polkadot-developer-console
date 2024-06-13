// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import assert from 'assert';
import type { AnyJson } from '@w3ux/types';
import * as metadataJson from './data/metadataV14.json';

/* Metadata sequence tests.

This test file verifies the structure and integrity of sequence types in metadata.

All sequences are scraped and run through tests.

The goal of this test suit is to document how sequence types are structured to the developer. 
*/

// Basic composite structure.
describe('Basic sequence structure is intact', () => {
  const lookup = metadataJson.lookup;
  const lookupTypes = lookup.types;

  // Get all composite types from lookup.
  const lookupSequence: AnyJson = lookupTypes
    .filter(({ type: { def } }) => 'sequence' in def)
    .map((item) => item.type.def.sequence);

  it('Metadata lookup contains 109 sequence types', () => {
    assert.ok(lookupSequence.length === 109);
  });

  it('Sequence types only contain one `type` property', () => {
    lookupSequence.every(
      (item: AnyJson) => 'type' in item && Object.keys(item).length === 1
    );
  });
});
