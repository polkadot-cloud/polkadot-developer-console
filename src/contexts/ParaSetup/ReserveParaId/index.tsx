// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { defaultReserveParaIdContext } from './defaults';
import type {
  ReserveOption,
  ReserveParaIdContextInterface,
  ReservedParaId,
} from './types';
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

  // Store the selected accounts for reserving a para id, keyed by tab.
  const [selectedAccounts, setSelectedAccounts] = useState<
    Record<string, string>
  >({});

  // Get a selected account for a tab.
  const getSelectedAccount = (tabId: number) => selectedAccounts[tabId];

  // Set an account for a tab.
  const setSelectedAccount = (tabId: number, address: string) => {
    setSelectedAccounts((prev) => ({
      ...prev,
      [tabId]: address,
    }));
  };

  // Remove an account for a tab.
  const removeSelectedAccount = (tabId: number) => {
    const updated = { ...selectedAccounts };
    delete updated[tabId];
    setSelectedAccounts(updated);
  };

  // Store the selected option for reserving a para id, keyed by tab.
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, ReserveOption>
  >({});

  // Get a reserve option for a tab.
  const getSelectedOption = (tabId: number) => selectedOptions[tabId] || 'new';

  // Set a reserve option for a tab.
  const setSelectedOption = (tabId: number, option: ReserveOption) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [tabId]: option,
    }));
  };

  // Remove a reserve option for a tab.
  const removeSelectedOption = (tabId: number) => {
    const updated = { ...selectedOptions };
    delete updated[tabId];
    setSelectedOptions(updated);
  };

  // Store existing para id inputs, keyed by tab.
  const [existingParaIdInputs, setExistingParaIdInputs] =
    useState<Record<number, string>>();

  // Get an existing para id input for a tab.
  const getExistingParaIdInput = (tabId: number) =>
    existingParaIdInputs?.[tabId] || '';

  // Set an existing para id input for a tab.
  const setExistingParaIdInput = (tabId: number, value: string) => {
    setExistingParaIdInputs((prev) => ({
      ...prev,
      [tabId]: value,
    }));
  };

  // Remove an existing para id input for a tab.
  const removeExistingParaIdInput = (tabId: number) => {
    const updated = { ...existingParaIdInputs };
    delete updated[tabId];
    setExistingParaIdInputs(updated);
  };

  // Store the fetched reserved para id entries, keyed by tab.
  const [reservedParaIds, setReservedParaIds] = useState<
    Record<number, ReservedParaId>
  >({});

  // Get a reserved para id entry for a tab.
  const getReservedParaId = (tabId: number) => reservedParaIds[tabId];

  // Set a reserved para id entry for a tab.
  const setReservedParaId = (tabId: number, entry: ReservedParaId) => {
    setReservedParaIds((prev) => ({
      ...prev,
      [tabId]: entry,
    }));
  };

  // Remove a reserved para id entry for a tab.
  const removeReservedParaId = (tabId: number) => {
    const updated = { ...reservedParaIds };
    delete updated[tabId];
    setReservedParaIds(updated);
  };

  return (
    <ReserveParaIdContext.Provider
      value={{
        // Manage next para id fetching.
        getNextParaId,
        setNextParaId,
        removeNextParaId,
        nextParaIdChainExists,
        addNextParaIdChain,
        removeNextParaIdChain,

        // Manage managers of para ids.
        getSelectedAccount,
        setSelectedAccount,
        removeSelectedAccount,

        // Manage para id reserve options.
        getSelectedOption,
        setSelectedOption,
        removeSelectedOption,

        // Manage existing para id inputs.
        getExistingParaIdInput,
        setExistingParaIdInput,
        removeExistingParaIdInput,

        // Manage reserved para id entries.
        getReservedParaId,
        setReservedParaId,
        removeReservedParaId,
      }}
    >
      {children}
    </ReserveParaIdContext.Provider>
  );
};
