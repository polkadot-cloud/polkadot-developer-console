// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { MetadataVersion, PalletsListItem } from './types';
import type { Metadata } from '@polkadot/types';

export class UnknownMetadata implements MetadataVersion {
  metadata: Metadata;

  constructor(metadata: Metadata) {
    this.metadata = metadata as AnyJson;
  }

  getMetadataJson(): AnyJson {
    return this.metadata.toJSON().metadata;
  }

  getPalletList(): PalletsListItem[] {
    const json = this.getMetadataJson();

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
