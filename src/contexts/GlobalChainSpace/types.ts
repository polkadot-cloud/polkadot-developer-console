// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ChainSpace } from 'model/ChainSpace';
import type { OwnerId } from 'types';

export interface GlobalChainSpaceContextInterface {
  globalChainSpace: {
    ownerId: OwnerId;
    getInstance: () => ChainSpace;
  };
}
