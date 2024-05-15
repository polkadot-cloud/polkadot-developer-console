// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
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
  PalletVersions,
  ChainUiNamespaceInner,
  ChainStateSections,
  ChainStateSection,
  InputNamespace,
  InputArgsState,
  InputArg,
} from './types';
import type { ApiPromise } from '@polkadot/api';
import { xxhashAsHex } from '@polkadot/util-crypto';
import { u16 } from 'scale-ts';
import type { AnyJson } from '@w3ux/utils/types';
import { PalletScraper } from 'model/Metadata/Scraper/Pallet';
import type { MetadataVersion } from 'model/Metadata/types';
import { setStateWithRef } from '@w3ux/utils';
import type { OwnerId } from 'types';

export const ChainUi =
  createContext<ChainUiContextInterface>(defaultChainContext);

export const useChainUi = () => useContext(ChainUi);

export const ChainUiProvider = ({ children }: { children: ReactNode }) => {
  // The UI state of the chain, keyed by tab.
  const [chainUi, setChainUi] = useState<ChainUiState>(defaultChainUiState);

  // The active chain state section, keyed by tab.
  const [activeChainStateSections, setActiveChainStateSections] =
    useState<ChainStateSections>({});

  // Stores pallet versions of a chain, keyed by tab.
  const [palletVersions, setPalletVersions] = useState<PalletVersions>({});

  // Stores the input arguments for either a storage item or call, keyed by tab. NOTE: Needs a ref
  // as multiple updates happen within the same render.
  const [inputArgs, setInputArgsState] = useState<InputArgsState>({});
  const inputArgsRef = useRef(inputArgs);

  // Setter for inputArgs. Updates state and ref.
  const setInputArgs = (value: InputArgsState) => {
    setStateWithRef(value, setInputArgsState, inputArgsRef);
  };

  // Gets an active chain state section by tabId. Falls back to 'storage'.
  const getActiveChainStateSection = (tabId: number): string =>
    activeChainStateSections[tabId] || 'storage';

  // Sets an active chain state section for a `tabId`.
  const setActiveChainStateSection = (
    tabId: number,
    section: ChainStateSection
  ) => {
    setActiveChainStateSections({
      ...activeChainStateSections,
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

  // Handle fetching of pallet versions.
  const fetchPalletVersions = async (
    ownerId: OwnerId,
    metadata: MetadataVersion,
    apiInstance: ApiPromise
  ) => {
    // Exit if pallet versions have already been fetched.
    if (palletVersions[ownerId] !== undefined) {
      return;
    }
    // Get pallet list from scraper.
    const scraper = new PalletScraper(metadata);
    const pallets = scraper.getList();

    // Map through pallets and set up an array of calls to query the RPC with.
    const calls = pallets.map(({ name }) => {
      const storageKey =
        xxhashAsHex(name, 128) +
        xxhashAsHex(':__STORAGE_VERSION__:', 128).slice(2);
      return apiInstance.rpc.state.getStorage(storageKey);
    });

    const result = await Promise.all(calls);

    const newPalletVersions = Object.fromEntries(
      result.map((element: AnyJson, index: number) => {
        // Empty return types can be assumed to be version 0.
        const versionAsHex = element.toHex();
        return [
          pallets[index].name,
          versionAsHex == '0x' ? '0' : String(u16.dec(element.toString())),
        ];
      })
    );

    // Set pallet version state for the provided tab.
    setPalletVersions((prev) => ({
      ...prev,
      [ownerId]: newPalletVersions,
    }));
  };

  // Get pallet versions by tab Id.
  const getPalletVersions = (
    ownerId: OwnerId
  ): Record<string, string> | undefined => palletVersions[ownerId];

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
    return inputArgsRef.current[tabId][namespace];
  };

  // Get input args at a key for either a storage item or call.
  const getInputArgsAtKey = (
    tabId: number,
    namespace: InputNamespace,
    key: string
  ) => {
    if (!inputArgsRef.current[tabId]) {
      return undefined;
    }
    const args = inputArgsRef.current[tabId][namespace];
    return args?.[key] || undefined;
  };

  // Set input args at a given input key for either a storage item or call.
  const setInputArgAtKey = (
    tabId: number,
    namespace: InputNamespace,
    key: string,
    arg: InputArg
  ) => {
    const updatedInputArgs = { ...inputArgsRef.current };

    // If an `InputArgs` record does not exist for the tab yet, add it now.
    if (!inputArgsRef.current[tabId]) {
      updatedInputArgs[tabId] = {
        storage: {},
        call: {},
      };
    }
    // Apply the new input arg and update state.
    updatedInputArgs[tabId][namespace][key] = arg;
    setInputArgs(updatedInputArgs);
  };

  // Reset input args at a given key for either a storage item or call.
  const resetInputArgSection = (tabId: number, namespace: InputNamespace) => {
    if (!inputArgsRef.current[tabId]) {
      return;
    }
    const updatedInputArgs = { ...inputArgsRef.current };

    // Reset the input args for the given namespace and update state.
    updatedInputArgs[tabId][namespace] = {};
    setInputArgs(updatedInputArgs);
  };

  // Reset input args for a tab.
  const destroyTabChainUi = (tabId: number) => {
    const updatedChainUi = { ...chainUi };
    delete updatedChainUi[tabId];

    const updatedChainStateSections = { ...activeChainStateSections };
    delete updatedChainStateSections[tabId];

    const updatedPalletVersions = { ...palletVersions };
    delete updatedPalletVersions[tabId];

    const updatedInputArgs = { ...inputArgsRef.current };
    delete updatedInputArgs[tabId];

    setChainUi(updatedChainUi);
    setActiveChainStateSections(updatedChainStateSections);
    setPalletVersions(updatedPalletVersions);
    setInputArgs(updatedInputArgs);
  };

  return (
    <ChainUi.Provider
      value={{
        chainUi,
        getChainUi,
        setChainUiNamespace,
        getPalletVersions,
        fetchPalletVersions,
        isChainUiValueEmpty,
        getActiveChainStateSection,
        setActiveChainStateSection,
        getInputArgs,
        getInputArgsAtKey,
        setInputArgAtKey,
        resetInputArgSection,
        destroyTabChainUi,
      }}
    >
      {children}
    </ChainUi.Provider>
  );
};
