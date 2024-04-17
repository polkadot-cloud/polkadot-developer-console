// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Metadata } from '@polkadot/types';
import type { MetadataVersion } from './types';
import type { AnyJson } from '@w3ux/utils/types';

export class MetadataV14 implements MetadataVersion {
  metadata: Metadata;

  constructor(metadata: Metadata) {
    this.metadata = metadata;
  }

  getMetadataJson() {
    const json = this.metadata.toJSON().metadata as { v14: unknown };
    return json.v14;
  }

  palletExists(palletName: string) {
    const json: AnyJson = this.getMetadataJson();
    console.log(json?.pallets);
    return (
      json?.pallets?.find(
        ({ name }: { name: string }) => name === palletName
      ) !== undefined
    );
  }
}
