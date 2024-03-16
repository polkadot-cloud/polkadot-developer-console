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

  // Attempts to fetch a sorted list of pallet names with their indexes from metadata, ordered
  // alphabetically by `name`.
  abstract getPalletList(): PalletsListItem[];
}

// Supported properties for metadata pallet list.
export interface PalletsListItem {
  index: number;
  name: string;
}
