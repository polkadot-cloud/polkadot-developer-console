// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { GlobalChainSpaceContextInterface } from './types';
import {
  GLOBAL_CHAIN_SPACE_OWNER,
  defaultGlboalChainSpaceContext,
} from './defaults';
import { ChainSpaceController } from 'controllers/ChainSpace';

export const GlobalChainSpace = createContext<GlobalChainSpaceContextInterface>(
  defaultGlboalChainSpaceContext
);

export const useGlobalChainSpace = () => useContext(GlobalChainSpace);

// Instantiate a global chain space.
ChainSpaceController.instantiate(GLOBAL_CHAIN_SPACE_OWNER);

export const GlobalChainSpaceProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <GlobalChainSpace.Provider
    value={{
      globalChainSpace: {
        ownerId: GLOBAL_CHAIN_SPACE_OWNER,
        getInstance: () =>
          ChainSpaceController.getInstance(GLOBAL_CHAIN_SPACE_OWNER),
      },
    }}
  >
    {children}
  </GlobalChainSpace.Provider>
);
