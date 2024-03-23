// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MetadataV14 } from 'model/Metadata/MetadataV14';
import type { MetadataVersion } from './types';
import { UnknownMetadata } from 'model/Metadata/UnknownMetadata';
import type { Metadata } from '@polkadot/types';
import { MetadataV15 } from 'model/Metadata/MetadataV15';

export class MetadataController {
  // Instantiate a metadata version.
  static instantiate(version: string, metadata: Metadata): MetadataVersion {
    switch (version) {
      case 'v15':
        return new MetadataV15(metadata);
      case 'v14':
        return new MetadataV14(metadata);
      default:
        return new UnknownMetadata(metadata);
    }
  }
}
