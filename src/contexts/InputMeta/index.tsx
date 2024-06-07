// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { defaultInputMetaContext } from './defaults';
import type { InputMetaContextInterface } from './types';

export const InputMetaContext = createContext<InputMetaContextInterface>(
  defaultInputMetaContext
);

export const useInputMeta = () => useContext(InputMetaContext);

export const InputMetaProvider = ({ children }: { children: ReactNode }) => {
  // Store input metadata, keyed by tabId and inputId.
  const [inputMeta, setInputMeta] = useState<
    Record<number, Record<string, string>>
  >({});

  // Get input meta value for a tabId and inputId.
  const getInputMetaValue = (tabId: number, inputId: string) =>
    inputMeta[tabId]?.[inputId];

  // Set input meta value for a tabId and inputId.
  const setInputMetaValue = (tabId: number, inputId: string, value: string) => {
    setInputMeta((prev) => ({
      ...prev,
      [tabId]: {
        ...prev[tabId],
        [inputId]: value,
      },
    }));
  };

  return (
    <InputMetaContext.Provider
      value={{
        getInputMetaValue,
        setInputMetaValue,
      }}
    >
      {children}
    </InputMetaContext.Provider>
  );
};
