// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { MetadataVersion, PalletsListItem } from './types';

export class UnknownMetadata implements MetadataVersion {
  metadata: AnyJson;

  constructor(metadata: AnyJson) {
    this.metadata = metadata;
  }

  getPalletList(): PalletsListItem[] {
    return (
      this.metadata?.pallets?.map(({ index, name }: PalletsListItem) => ({
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
