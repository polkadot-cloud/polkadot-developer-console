// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';

export interface CompositeType {
  fields: CompositeField[];
}

export interface CompositeField {
  docs: string[];
  name: string;
  type: AnyJson;
  typeName: string;
}
