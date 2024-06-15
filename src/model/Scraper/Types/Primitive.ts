// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Base } from './Common/Base';
import type { BaseParams, MetadataType } from './types';

// Class to hold a primitive type.
export class Primitive extends Base implements MetadataType {
  type = 'primitive';

  // The type of this primitive.
  primitive: string;

  constructor(primitive: string, { lookup, depth }: BaseParams) {
    super(lookup, depth);
    this.primitive = primitive;
  }

  // Get the label of this primitive.
  override label() {
    return this.primitive.toLowerCase();
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
