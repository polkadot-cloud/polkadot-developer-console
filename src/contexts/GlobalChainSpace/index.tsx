// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef } from 'react';
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
const index = ChainSpaceController.instantiate(GLOBAL_CHAIN_SPACE_OWNER);

export const GlobalChainSpaceProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // The index of the global parachain setup chain space.
  const globalChainSpaceIndex = useRef<number>(index);

  return (
    <GlobalChainSpace.Provider
      value={{
        globalChainSpace: {
          ownerId: GLOBAL_CHAIN_SPACE_OWNER,
          index: globalChainSpaceIndex.current,
        },
      }}
    >
      {children}
    </GlobalChainSpace.Provider>
  );
};
