// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  ApiIndexerContextInterface,
  ApiIndexes,
  ApiIndex,
  ApiIndexLabel,
} from './types';
import { defaultApiIndexerContext } from './defaults';
import type { OwnerId } from 'types';

export const ApiIndexer = createContext<ApiIndexerContextInterface>(
  defaultApiIndexerContext
);

export const useApiIndexer = () => useContext(ApiIndexer);

export const ApiIndexerProvider = ({ children }: { children: ReactNode }) => {
  // Store active api indexes and labels, keyed by tab owner id.
  const [apiIndexes, setApiIndexesState] = useState<ApiIndexes>({});
  const apiIndexesRef = useRef<ApiIndexes>(apiIndexes);

  const setApiIndexes = (indexes: ApiIndexes) => {
    apiIndexesRef.current = indexes;
    setApiIndexesState(indexes);
  };

  // Get all api indexes for an owner.
  const getTabApiIndexes = (ownerId: OwnerId) =>
    apiIndexesRef.current[ownerId] || [];

  // Get an api index for an owner by its label.
  const getTabApiIndex = (
    ownerId: OwnerId,
    label: ApiIndexLabel | undefined
  ) => {
    const apiIndex = apiIndexesRef.current[ownerId]?.find(
      (index) => index.label === label
    );

    if (!apiIndex) {
      return undefined;
    }

    return {
      ...apiIndex,
      instanceId: `${ownerId}_${apiIndex.index}`,
    };
  };

  // Set an api index for a tab.
  const setTabApiIndex = (ownerId: OwnerId, index: ApiIndex) => {
    const updated = { ...apiIndexesRef.current };
    if (updated[ownerId]) {
      updated[ownerId].push(index);
    } else {
      updated[ownerId] = [index];
    }
    setApiIndexes(updated);
  };

  // Remove an api index for an owner.
  const removeTabApiIndex = (ownerId: OwnerId, index: number) => {
    const updated = { ...apiIndexesRef.current };
    updated[ownerId] =
      updated[ownerId]?.filter((apiIndex) => apiIndex.index !== index) || [];

    if (updated[ownerId]?.length === 0) {
      delete updated[ownerId];
    }
    setApiIndexes(updated);
  };

  // Remove api indexes for an owner.
  const removeTabApiIndexes = (ownerId: OwnerId) => {
    const updated = { ...apiIndexesRef.current };
    delete updated[ownerId];
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
