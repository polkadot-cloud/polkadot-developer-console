// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext } from 'react';
import type { ChainContextProps, IntegrityCheckedChainContext } from './types';
import { defaultChainContextInterface } from './defaults';

export const ChainProvider = createContext<IntegrityCheckedChainContext>(
  defaultChainContextInterface
);

export const useChain = () => useContext(ChainProvider);

// Post-integrity checks provider for chain explorer task.
export const ChainContext = ({ children, ...rest }: ChainContextProps) => (
  <ChainProvider.Provider value={rest}>{children}</ChainProvider.Provider>
);
