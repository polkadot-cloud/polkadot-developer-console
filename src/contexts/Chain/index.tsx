// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { ChainInterface } from './types';
import { defaultChainContext } from './defaults';

export const Chain = createContext<ChainInterface>(defaultChainContext);

export const useChain = () => useContext(Chain);

export const ChainProvider = ({ children }: { children: ReactNode }) => (
  <Chain.Provider value={{}}>{children}</Chain.Provider>
);
