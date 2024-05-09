// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainSpace } from 'model/ChainSpace';
import type { OwnerId } from 'types';

export interface GlobalChainSpaceContextInterface {
  globalChainSpace: {
    ownerId: OwnerId;
    index: number;
    getInstance: () => ChainSpace;
  };
}
