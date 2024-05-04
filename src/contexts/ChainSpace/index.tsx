// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef } from 'react';
import type { ChainSpaceContextInterface } from './types';
import { GLOBAL_CHAIN_SPACE_OWNER, defaultChainStateContext } from './defaults';
import { ChainSpaceController } from 'controllers/ChainSpace';

export const ChainSpace = createContext<ChainSpaceContextInterface>(
  defaultChainStateContext
);

export const useChainSpace = () => useContext(ChainSpace);

export const ChainSpaceProvider = ({ children }: { children: ReactNode }) => {
  // The index of the global parachain setup chain space.
  const globalChainSpaceIndex = useRef<number | undefined>(undefined);

  // Handle initialisation of global chain space.
  const handleGlobalChainSpaceSetup = async () => {
    // Instantiate a global chain space for parachain setup.
    const index = ChainSpaceController.instantiate(GLOBAL_CHAIN_SPACE_OWNER);
    globalChainSpaceIndex.current = index;
  };

  // On app start, instantiate a global chain space for parachain setup.
  useEffect(() => {
    handleGlobalChainSpaceSetup();
  }, []);

  return (
    <ChainSpace.Provider
      value={{
        globalChainSpace: {
          ownerId: GLOBAL_CHAIN_SPACE_OWNER,
          index: globalChainSpaceIndex.current,
        },
      }}
    >
      {children}
    </ChainSpace.Provider>
  );
};
