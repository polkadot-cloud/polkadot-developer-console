// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useState, type ReactNode } from 'react';
import { defaultChainStateContext } from './defaults';
import type {
  ChainStateContextInterface,
  ChainStateSubscriptions,
} from './types';
import type { AnyJson } from '@w3ux/utils/types';

export const ChainState = createContext<ChainStateContextInterface>(
  defaultChainStateContext
);

export const useChainState = () => useContext(ChainState);

export const ChainStateProvider = ({ children }: { children: ReactNode }) => {
  // The results of current chain state subscriptions.
  const [chainStateSubscriptions, setChainStateSubscriptions] =
    useState<ChainStateSubscriptions>({});

  // Get a chain state subscription by key.
  const getChainStateItem = (key: string) => chainStateSubscriptions[key];

  // Set a chain state subscription by key.
  const setChainStateItem = (key: string, value: AnyJson) => {
    setChainStateSubscriptions((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ChainState.Provider
      value={{
        getChainStateItem,
        setChainStateItem,
      }}
    >
      {children}
    </ChainState.Provider>
  );
};
