// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';

export interface VariantType {
  variants: VariantItem[];
}
export interface VariantItem {
  name: string | null;
  fields: VariantField[];
  index: number;
  docs: string[];
}

export interface VariantField {
  docs: string[];
  name: string;
  type: AnyJson;
  typeName: string;
}
