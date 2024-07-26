// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { Base } from './Common/Base';
import type { BaseParams, MetadataType } from './types';

// Class to hold a primitive type.
export class PrimitiveType extends Base implements MetadataType {
  type = 'primitive';

  // The type of this primitive.
  primitive: string;

  constructor(primitive: string, base: BaseParams) {
    super(base);
    this.primitive = primitive;
    this.label = this.primitive.toLowerCase();
  }

  // Get the input type of this primitive.
  input() {
    const primitiveLower = this.primitive.toLowerCase();
    return ['char', 'str', 'i8', 'i16', 'i32', 'i64', 'i128'].includes(
      primitiveLower
    )
      ? 'text'
      : primitiveLower === 'bool'
        ? 'checkbox'
        : 'number';
  }

  // Scrape primitive type. Simply returns the type.
  scrape() {
    return this.primitive;
  }
}
