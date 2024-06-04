// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
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
  abstract get(): AnyJson;

  // Returns whether a pallet exists in the metadata.
  abstract palletExists: (palletName: string) => boolean;
}
