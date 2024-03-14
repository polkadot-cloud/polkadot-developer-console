// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */

import type { AnyJson } from '@w3ux/utils/types';

export class MetadataVersion {
  // JSON representation of metadata.
  metadata: AnyJson;

  // Pass the metadata to the constructor.
  constructor(metadata: AnyJson) {
    this.metadata = metadata;
  }
}
