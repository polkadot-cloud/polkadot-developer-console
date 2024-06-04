// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import { ChainSpaceController } from 'controllers/ChainSpace';
import type { GlobalChainSpaceContextInterface } from './types';

export const GLOBAL_CHAIN_SPACE_OWNER = 'global';

export const defaultGlboalChainSpaceContext: GlobalChainSpaceContextInterface =
  {
    globalChainSpace: {
      ownerId: GLOBAL_CHAIN_SPACE_OWNER,
      getInstance: () =>
        ChainSpaceController.getInstance(GLOBAL_CHAIN_SPACE_OWNER),
    },
  };
