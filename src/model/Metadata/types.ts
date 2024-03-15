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

  // Attempts to fetch a sorted list of pallet names with their indexes from metadata, ordered
  // alphabetically by `name`.
  getPalletList(): PalletsListItem[] {
    return [];
  }
}

// Supported properties for metadata pallet list.
export interface PalletsListItem {
  index: number;
  name: string;
}
