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
  const parachainSetupChainSpaceIndex = useRef<number | undefined>(undefined);

  // On app start, instantiate a global chain space for parachain setup.
  useEffect(() => {
    const index = ChainSpaceController.instantiate(GLOBAL_CHAIN_SPACE_OWNER);
    parachainSetupChainSpaceIndex.current = index;
  }, []);

  return (
    <ChainSpace.Provider
      value={{
        parachainSetupChainSpaceIndex: parachainSetupChainSpaceIndex.current,
      }}
    >
      {children}
    </ChainSpace.Provider>
  );
};
