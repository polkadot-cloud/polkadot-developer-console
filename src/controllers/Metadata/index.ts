// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MetadataV14 } from 'model/Metadata/MetadataV14';
import type { MetadataVersion } from './types';
import { UnknownMetadata } from 'model/Metadata/UnknownMetadata';

export class MetadataController {
  // Instantiate a metadata version.
  static instantiate(
    version: string,
    metadata: MetadataVersion
  ): MetadataVersion {
    switch (version) {
      case 'v14':
        return new MetadataV14(metadata);
      default:
        return new UnknownMetadata(metadata);
    }
  }
}
