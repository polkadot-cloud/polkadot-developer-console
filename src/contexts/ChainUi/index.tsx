// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useRef, useState } from 'react';
import {
  defaultChainContext,
  defaultChainUiInner,
  defaultChainUiNamespace,
  defaultChainUiState,
} from './defaults';
import type {
  ChainUiState,
  ChainUiContextInterface,
  ChainUiNamespace,
  ChainUiNamespaceInner,
  ChainStateSections,
  ChainStateSection,
  InputNamespace,
  InputArgsState,
  ChainStateFilters,
  InputArgTypeKeys,
} from './types';
import { setStateWithRef } from '@w3ux/utils';
import type { StorageType } from 'model/ChainState/types';
import * as local from './Local';
import { checkLocalChainUi } from 'IntegrityChecks/Local';
import type { AnyJson } from '@w3ux/types';

checkLocalChainUi();

export const ChainUi =
  createContext<ChainUiContextInterface>(defaultChainContext);

export const useChainUi = () => useContext(ChainUi);

export const ChainUiProvider = ({ children }: { children: ReactNode }) => {
  // The UI state of the chain, keyed by tab.
  const [chainUi, setChainUiState] = useState<ChainUiState>(
    local.getChainUi() || defaultChainUiState
  );

  // Setter for chain ui.
  const setChainUi = (value: ChainUiState) => {
    local.setChainUi(value);
    setChainUiState(value);
  };

  // The active chain state section, keyed by tab.
  const [chainStateSections, setChainStateSectionsState] =
    useState<ChainStateSections>(local.getChainStateSections() || {});

  // Setter for active chain state sections.
  const setChainStateSections = (value: ChainStateSections) => {
    local.setChainStateSections(value);
    setChainStateSectionsState(value);
  };

  // Active chain state result filters, keyed by tab.
  const [activeChainStateFilters, setActiveChainStateFiltersState] =
    useState<ChainStateFilters>(local.getChainStateFilters() || {});

  // Setter for chain state filters.
  const setActiveChainStateFilters = (value: ChainStateFilters) => {
    local.setChainStateFilters(value);
    setActiveChainStateFiltersState(value);
  };

  // Stores the input arguments for either a storage item or call, keyed by tab. NOTE: Needs a ref
  // as multiple updates happen within the same render.
  const [inputArgs, setInputArgsState] = useState<InputArgsState>({});
  const inputArgsRef = useRef(inputArgs);

  // Setter for inputArgs. Updates state and ref.
  const setInputArgs = (value: InputArgsState) => {
    setStateWithRef(value, setInputArgsState, inputArgsRef);
  };

  // Gets an active chain state section by tabId. Falls back to 'storage'.
  const getChainStateSection = (tabId: number): string =>
    chainStateSections[tabId] || 'storage';

  // Sets an active chain state section for a `tabId`.
  const setChainStateSection = (tabId: number, section: ChainStateSection) => {
    setChainStateSections({
      ...chainStateSections,
      [tabId]: section,
    });
  };

  // Gets a ChainUi record by tabId.
  const getChainUi = (
    tabId: number,
    namespace: keyof ChainUiNamespace
  ): ChainUiNamespaceInner =>
    chainUi[tabId]?.[namespace] || defaultChainUiInner;

  // Sets a ChainUi record for a tabId and inner key.
  const setChainUiNamespace = (
    tabId: number,
    namespace: keyof ChainUiNamespace,
    key: string,
    value: string | boolean
  ) => {
    const currentChainUi = chainUi[tabId] || defaultChainUiNamespace;
    const currentChainUiNamespace =
      currentChainUi[namespace] || defaultChainUiInner;

    const newChainUiInner = {
      ...currentChainUiNamespace,
      [key]: value,
      // Reset selected value if the pallet is being changed.
      selected:
        key === 'pallet'
          ? ''
          : key === 'selected'
            ? value
            : currentChainUiNamespace.selected,
      // Reset search value if the pallet is being changed.
      search:
        key === 'pallet'
          ? ''
          : key === 'search'
            ? value
            : currentChainUiNamespace.search,
    };

    setChainUi({
      ...chainUi,
      [tabId]: {
        ...currentChainUi,
        [namespace]: newChainUiInner,
      },
    });
  };

  // Get a storage item filter for a tab, or return false if it does not exist.
  const getStorageItemFilter = (tabId: number, key: StorageType): boolean =>
    activeChainStateFilters?.[tabId]?.[key] || false;

  // Set a storage item filter for a tab.
  const setStorageItemFilter = (
    tabId: number,
    key: StorageType,
    value: boolean
  ) => {
    const updatedFilters = { ...activeChainStateFilters };
    updatedFilters[tabId] = { ...updatedFilters[tabId], [key]: value };
    setActiveChainStateFilters(updatedFilters);
  };

  // Check if a chainUI value is empty. For boolean types, return empty if false. This function should be used on strings, but for type safety booleans are also supported.
  const isChainUiValueEmpty = (
    tabId: number,
    namespace: keyof ChainUiNamespace,
    key: keyof ChainUiNamespaceInner
  ): boolean => {
    const chainUiItem = getChainUi(tabId, namespace);
    const val = chainUiItem[key];

    if (typeof val === 'string') {
      return val.length === 0;
    }
    return !!val;
  };

  // Get input args for either a storage item or call.
  const getInputArgs = (tabId: number, namespace: InputNamespace) => {
    if (!inputArgsRef.current[tabId]) {
      return null;
    }

    const inputArgsWithKeys = inputArgsRef.current[tabId][namespace];
    if (!inputArgsWithKeys) {
      return null;
    }

    return inputArgsWithKeys || null;
  };

  // Get input args at a key for either a storage item or call.
  const getInputArgAtKey = (
    tabId: number,
    namespace: InputNamespace,
    inputKey: string
  ) => {
    if (!inputArgsRef.current[tabId]) {
      return undefined;
    }
    const args = inputArgsRef.current[tabId][namespace];
    return args?.[inputKey] || undefined;
  };

  // Set input args at a given input key for either a storage item or call.
  const setInputArgAtKey = (
    tabId: number,
    namespace: InputNamespace,
    keys: InputArgTypeKeys,
    value: AnyJson
  ) => {
    const { inputKey, indexKey } = keys;
    const updatedInputArgs = { ...inputArgsRef.current };

    // If an `InputArgs` record does not exist for the tab yet, add it now.
    if (!inputArgsRef.current[tabId]) {
      updatedInputArgs[tabId] = {
        storage: {},
        call: {},
      };
    }
    // Apply the new input arg and update state.
    updatedInputArgs[tabId][namespace][inputKey] = { indexKey, value };
    setInputArgs(updatedInputArgs);
  };

  // Reset input args at a given key and namespace.
  const resetInputArgs = (tabId: number, namespace: InputNamespace) => {
    if (!inputArgsRef.current[tabId]) {
      return;
    }
    const updatedInputArgs = { ...inputArgsRef.current };

    // Reset the input args for the given namespace and update state.
    updatedInputArgs[tabId][namespace] = {};
    setInputArgs(updatedInputArgs);
  };

  // Reset input args from an input key and namespace.
  const resetInputArgsFromKey = (
    tabId: number,
    namespace: InputNamespace,
    fromKey: string
  ) => {
    if (!inputArgsRef.current[tabId]) {
      return;
    }

    // Duplicate arg state for manipulation.
    const updatedInputArgs = { ...inputArgsRef.current };
    const args = updatedInputArgs[tabId][namespace];

    // TODO: Iterate through keys state and remove keys that start with `fromKey`.
    console.debug('delete from', fromKey);

    // Update state.
    updatedInputArgs[tabId][namespace] = args;
    setInputArgs(updatedInputArgs);
  };

  // Reset state for a tab.
  const destroyTabChainUi = (tabId: number) => {
    const updatedChainUi = { ...chainUi };
    delete updatedChainUi[tabId];

    const updatedChainStateSections = { ...chainStateSections };
    delete updatedChainStateSections[tabId];

    const updatedChainStateFilters = { ...activeChainStateFilters };
    delete updatedChainStateFilters[tabId];

    const updatedInputArgs = { ...inputArgsRef.current };
    delete updatedInputArgs[tabId];

    setActiveChainStateFilters(updatedChainStateFilters);
    setChainUi(updatedChainUi);
    setChainStateSections(updatedChainStateSections);
    setInputArgs(updatedInputArgs);
  };

  return (
    <ChainUi.Provider
      value={{
        chainUi,
        getChainUi,
        setChainUiNamespace,
        isChainUiValueEmpty,
        getChainStateSection,
        setChainStateSection,
        getStorageItemFilter,
        setStorageItemFilter,
        getInputArgs,
        getInputArgAtKey,
        setInputArgAtKey,
        resetInputArgs,
        resetInputArgsFromKey,
        destroyTabChainUi,
      }}
    >
      {children}
    </ChainUi.Provider>
  );
};
