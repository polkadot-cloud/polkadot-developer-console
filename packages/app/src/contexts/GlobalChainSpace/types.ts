// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ChainSpace } from 'model/ChainSpace';
import type { OwnerId } from 'types';

export interface GlobalChainSpaceContextInterface {
  globalChainSpace: {
    ownerId: OwnerId;
    getInstance: () => ChainSpace;
  };
}
