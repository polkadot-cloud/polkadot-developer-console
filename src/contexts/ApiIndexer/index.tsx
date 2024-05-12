// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ApiIndexerContextInterface, ApiIndexes, ApiIndex } from './types';
import { defaultApiIndexerContext } from './defaults';

export const ApiIndexer = createContext<ApiIndexerContextInterface>(
  defaultApiIndexerContext
);

export const useApiIndexer = () => useContext(ApiIndexer);

export const ApiIndexerProvider = ({ children }: { children: ReactNode }) => {
  // Store active api indexes and labels, keyed by tab.
  const [apiIndexes, setApiIndexesState] = useState<ApiIndexes>({});
  const apiIndexesRef = useRef<ApiIndexes>(apiIndexes);

  const setApiIndexes = (indexes: ApiIndexes) => {
    apiIndexesRef.current = indexes;
    setApiIndexesState(indexes);
  };

  // Get all api indexes for a tab.
  const getTabApiIndexes = (tabId: number) =>
    apiIndexesRef.current[tabId] || [];

  // Get an api index for a tab by its label.
  const getTabApiIndex = (tabId: number, label: string | undefined) =>
    apiIndexesRef.current[tabId]?.find((index) => index.label === label);

  // Set an api index for a tab.
  const setTabApiIndex = (tabId: number, index: ApiIndex) => {
    const updated = { ...apiIndexesRef.current };
    if (updated[tabId]) {
      updated[tabId].push(index);
    } else {
      updated[tabId] = [index];
    }
    setApiIndexes(updated);
  };

  // Remove an api index for a tab, given its label.
  const removeTabApiIndex = (tabId: number, label: string) => {
    const updated = { ...apiIndexesRef.current };
    updated[tabId] = updated[tabId]?.filter((index) => index.label !== label);
    if (updated[tabId]?.length === 0) {
      delete updated[tabId];
    }
    setApiIndexes(updated);
  };

  // Remove api indexes for a tab.
  const removeTabApiIndexes = (tabId: number) => {
    const updated = { ...apiIndexesRef.current };
    delete updated[tabId];
    setApiIndexes(updated);
  };

  return (
    <ApiIndexer.Provider
      value={{
        apiIndexes,
        getTabApiIndexes,
        getTabApiIndex,
        setTabApiIndex,
        removeTabApiIndexes,
        removeTabApiIndex,
      }}
    >
      {children}
    </ApiIndexer.Provider>
  );
};
