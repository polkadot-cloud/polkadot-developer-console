// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Metadata } from '@polkadot/types';
import type { MetadataVersion, PalletsListItem } from './types';
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

  getPalletList(): PalletsListItem[] {
    const json = this.getMetadataJson();

    // TODO: try and catch this method to handle invalid metadata.
    return (
      json.pallets.map(({ index, name }: PalletsListItem) => ({
        index,
        name,
      })) || []
    ).sort(
      (
        { name: aName }: { name: string },
        { name: bName }: { name: string }
      ) => {
        if (aName < bName) {
          return -1;
        }
        if (aName > bName) {
          return 1;
        }
        return 0;
      }
    );
  }
}
