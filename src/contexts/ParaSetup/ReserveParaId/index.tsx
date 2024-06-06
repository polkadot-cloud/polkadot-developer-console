// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { defaultReserveParaIdContext } from './defaults';
import type { ReserveParaIdContextInterface } from './types';
import type { ChainId } from 'config/networks/types';

export const ReserveParaIdContext =
  createContext<ReserveParaIdContextInterface>(defaultReserveParaIdContext);

export const useReserveParaId = () => useContext(ReserveParaIdContext);

export const ReserveParaIdProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Store the next free para id, keyed by chain. Once a subscription has been initialised, all tabs
  // can use an existing value for the chain in question. NOTE: Requires a ref as state updates are
  // used in event callbacks.
  const [nextParaId, setNextParaIdState] = useState<
    Partial<Record<ChainId, string>>
  >({});
  const nextParaIdRef = useRef(nextParaId);

  // Keep track of the chains that have initialised next para id subscriptions.
  const initialisedNextParaIdChains = useRef<ChainId[]>([]);

  // Check if next para id has been initialised for a chain.
  const nextParaIdChainExists = (chainId: ChainId) =>
    initialisedNextParaIdChains.current.includes(chainId);

  // Add chain to initialised next para ids.
  const addNextParaIdChain = (chainId: ChainId) => {
    if (!initialisedNextParaIdChains.current.includes(chainId)) {
      initialisedNextParaIdChains.current.push(chainId);
    }
  };

  // Remove chain from initialised next para ids.
  const removeNextParaIdChain = (chainId: ChainId) => {
    const index = initialisedNextParaIdChains.current.indexOf(chainId);
    if (index >= 0) {
      initialisedNextParaIdChains.current.splice(index, 1);
    }
  };

  // Get a para id for a chain.
  const getNextParaId = (chainId: ChainId) => nextParaId[chainId];

  // Set a para id for a chain.
  const setNextParaId = (chainId: ChainId, paraId: string) => {
    if (!chainId) {
      return;
    }
    const updated = { ...nextParaIdRef.current };
    updated[chainId] = paraId;

    nextParaIdRef.current = updated;
    setNextParaIdState(updated);
  };

  // Remove a para id for a chain.
  const removeNextParaId = (chainId: ChainId) => {
    const updated = { ...nextParaIdRef.current };
    delete updated[chainId];

    nextParaIdRef.current = updated;
    setNextParaIdState(updated);
  };

  return (
    <ReserveParaIdContext.Provider
      value={{
        getNextParaId,
        setNextParaId,
        removeNextParaId,
        nextParaIdChainExists,
        addNextParaIdChain,
        removeNextParaIdChain,
      }}
    >
      {children}
    </ReserveParaIdContext.Provider>
  );
};
