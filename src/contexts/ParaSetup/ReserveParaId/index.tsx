// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import { defaultReserveParaIdContext } from './defaults';
import type {
  ParaIdWithManager,
  ReserveOption,
  ReserveParaIdContextInterface,
  ReservedParaId,
  ReservedParaIdData,
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

  // Store reserve para id form data, keyed by tab.
  const [reserveParaIdData, setReserveParaIdData] =
    useState<ReservedParaIdData>({});

  // Get a selected account for a tab.
  const getSelectedAccount = (tabId: number) =>
    reserveParaIdData[tabId]?.selectedAccount;

  // Set an account for a tab.
  const setSelectedAccount = (tabId: number, address: string) => {
    setReserveParaIdData((prev) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        selectedAccount: address,
      },
    }));
  };

  // Get a reserve option for a tab.
  const getSelectedOption = (tabId: number) =>
    reserveParaIdData[tabId]?.selectedOption || 'new';

  // Set a reserve option for a tab.
  const setSelectedOption = (tabId: number, option: ReserveOption) => {
    setReserveParaIdData((prev) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        selectedOption: option,
      },
    }));
  };

  // Get an existing para id input for a tab.
  const getExistingParaIdInput = (tabId: number) =>
    reserveParaIdData[tabId]?.existingParaIdInput || '';

  // Set an existing para id input for a tab.
  const setExistingParaIdInput = (tabId: number, value: string) => {
    setReserveParaIdData((prev) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        existingParaIdInput: value,
      },
    }));
  };

  // Get a reserved para id entry for a tab.
  const getExistingReservedParaId = (tabId: number) =>
    reserveParaIdData[tabId]?.existingReservedParaId;

  // Set a reserved para id entry for a tab.
  const setExistingReservedParaId = (
    tabId: number,
    entry: ReservedParaId | null
  ) => {
    setReserveParaIdData((prev) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        existingReservedParaId: entry,
      },
    }));
  };

  // Get a reserved para id for a tab.
  const getReservedNextParaId = (tabId: number, manager: string) => {
    const current = reserveParaIdData[tabId]?.reservedNextParaIds;
    if (current) {
      return current?.[manager];
    }
  };

  // Set a reserved para id for a tab.
  const setReservedNextParaId = (
    tabId: number,
    manager: string,
    paraId: string
  ) => {
    const updated = { ...reserveParaIdData };
    const current = updated[tabId]?.reservedNextParaIds || {};
    const newRecord = { [manager]: { paraId, manager } };

    if (!updated[tabId]) {
      updated[tabId] = {};
    }

    if (!current) {
      // New record if tab data does not exist.
      updated[tabId].reservedNextParaIds = { ...newRecord };
    } else {
      // Update manager entry if tab record exists.
      updated[tabId] = {
        ...updated[tabId],
        reservedNextParaIds: {
          ...current,
          ...newRecord,
        },
      };
    }

    setReserveParaIdData(updated);
  };

  // Remove para id data for a tab.
  const removeTabParaIdData = (tabId: number) => {
    setReserveParaIdData((prev) => {
      const updated = { ...prev };
      delete updated[tabId];
      return updated;
    });
  };

  // Method that checks if a stored para id for a tab is valid (i.e. the next free id has been
  // reserved, or a valid existing one exists.
  const validateParaId = (
    tabId: number,
    manager: string
  ): ParaIdWithManager | undefined => {
    const selectedOption = getSelectedOption(tabId);
    const selectedAccount = getSelectedAccount(tabId);
    const reservedParaId = getExistingReservedParaId(tabId);
    const reservedNextParaId = getReservedNextParaId(tabId, manager);

    // Valid existing para id if chain record manager matches selected account.
    const existingParaIdValid =
      selectedAccount && selectedAccount === reservedParaId?.manager;
    if (selectedOption === 'existing' && existingParaIdValid) {
      return { paraId: reservedParaId.paraId, manager };
    }

    // Check if a reserved next para id is valid.
    // reserved id for an account.
    if (selectedOption === 'new' && !!reservedNextParaId) {
      return { paraId: reservedNextParaId.paraId, manager };
    }

    return undefined;
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

        // Manage para id reserve options.
        getSelectedOption,
        setSelectedOption,

        // Manage existing para id inputs.
        getExistingParaIdInput,
        setExistingParaIdInput,

        // Manage reserved para id entries.
        getExistingReservedParaId,
        setExistingReservedParaId,

        // Manage reserved para ids via next free id.
        getReservedNextParaId,
        setReservedNextParaId,

        validateParaId,

        removeTabParaIdData,
      }}
    >
      {children}
    </ReserveParaIdContext.Provider>
  );
};
