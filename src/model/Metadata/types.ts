// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */

import type { Metadata } from '@polkadot/types';
import type { AnyJson } from '@w3ux/utils/types';

export abstract class MetadataVersion {
  // JSON representation of metadata.
  abstract metadata: Metadata;

  // Pass the metadata to the constructor.
  constructor(metadata: Metadata) {}

  // Returns the JSON representation of metadata.
  abstract getMetadataJson(): AnyJson;
}
