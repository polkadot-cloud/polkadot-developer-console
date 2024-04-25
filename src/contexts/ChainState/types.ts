// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';

export interface ChainStateContextInterface {
  getChainStateItem: (key: string) => AnyJson;
  setChainStateItem: (key: string, value: AnyJson) => void;
}

export type ChainStateSubscriptions = Record<string, AnyJson>;
