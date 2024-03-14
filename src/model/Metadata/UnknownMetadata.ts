// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { MetadataVersion } from './types';

export class UnknownMetadata implements MetadataVersion {
  metadata: AnyJson;

  constructor(metadata: AnyJson) {
    this.metadata = metadata;
  }
}
