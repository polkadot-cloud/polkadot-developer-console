// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { MetadataV15 } from 'model/Metadata/MetadataV15';
import type { MetadataVersion } from './types';
import type { AnyJson } from '@w3ux/types';

export class MetadataController {
  // Instantiate a metadata version.
  static instantiate(metadata: AnyJson): MetadataVersion {
    return new MetadataV15(metadata);
  }
}
