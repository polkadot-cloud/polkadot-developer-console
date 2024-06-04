// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Metadata } from '@polkadot/types';
import type { MetadataVersion } from './types';
import type { AnyJson } from '@w3ux/utils/types';

export class MetadataV14 implements MetadataVersion {
  metadata: Metadata;

  constructor(metadata: Metadata) {
    this.metadata = metadata;
  }

  get() {
    const json = this.metadata as unknown;
    return json;
  }

  palletExists(palletName: string) {
    const json: AnyJson = this.get();
    return (
      json?.pallets?.find(
        ({ name }: { name: string }) => name === palletName
      ) !== undefined
    );
  }
}
