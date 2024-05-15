// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MetadataV14 } from 'model/Metadata/MetadataV14';
import type { MetadataVersion } from './types';
import { UnknownMetadata } from 'model/Metadata/UnknownMetadata';
import { MetadataV15 } from 'model/Metadata/MetadataV15';
import type { AnyJson } from '@w3ux/utils/types';

export class MetadataController {
  // Instantiate a metadata version.
  static instantiate(version: string, metadata: AnyJson): MetadataVersion {
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
