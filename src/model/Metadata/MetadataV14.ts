// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Metadata } from '@polkadot/types';
import type { MetadataVersion } from './types';
import type { AnyJson } from '@w3ux/utils/types';

export class MetadataV14 implements MetadataVersion {
  metadata: Metadata;

  constructor(metadata: Metadata) {
    this.metadata = metadata;
  }

  getMetadataJson() {
    const json: AnyJson = this.metadata.toJSON().metadata;
    return json.v14;
  }
}
