// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';

export interface InputItem {
  form: AnyJson;
  label: string;
}

export interface InputArray extends InputItem {
  len: number;
}
