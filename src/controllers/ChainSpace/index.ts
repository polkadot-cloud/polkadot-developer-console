// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { OwnerId } from 'types';
import type { ChainSpace } from 'model/ChainSpace';

export class ChainSpaceController {
  // ------------------------------------------------------
  // Class members.
  // ------------------------------------------------------

  // The currently instantiated ChainSpace instances, keyed by ownerId.
  static #instances: Record<OwnerId, Record<number, ChainSpace>> = {};
}
