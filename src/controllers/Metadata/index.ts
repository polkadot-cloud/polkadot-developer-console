// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { MetadataV14 } from 'model/Metadata/MetadataV14';
import type { MetadataVersion } from './types';
import type { AnyJson } from '@w3ux/utils/types';

export class MetadataController {
  // Instantiate a metadata version.
  static instantiate(metadata: AnyJson): MetadataVersion {
    return new MetadataV14(metadata);
  }
}
