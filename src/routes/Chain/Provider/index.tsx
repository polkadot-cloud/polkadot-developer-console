// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import { createContext, useContext } from 'react';
import type { ChainContextProps } from './types';

export const ChainProvider = createContext<AnyJson>({});
export const useChain = () => useContext(ChainProvider);

// Post-integrity checks provider for chain explorer tasks.
export const ChainContext = ({ children, ...rest }: ChainContextProps) => (
  <ChainProvider.Provider value={rest}>{children}</ChainProvider.Provider>
);
