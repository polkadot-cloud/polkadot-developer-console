// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { Metadata } from '@polkadot/types';
import type { MetadataVersion } from './types';
import type { AnyJson } from '@w3ux/types';

export class MetadataV15 implements MetadataVersion {
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
