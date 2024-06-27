// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import type {
  RegisterParathreadContextInterface,
  RuntimeValues,
} from './types';
import { defaultRegisterParathreadContext } from './defaults';

export const RegisterParathreadContext =
  createContext<RegisterParathreadContextInterface>(
    defaultRegisterParathreadContext
  );

export const useRegisterParathread = () =>
  useContext(RegisterParathreadContext);

export const RegisterParathreadProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  // Store the Webassembly runtime values, keyed by tab.
  const [runtimes, setRuntimeValues] = useState<RuntimeValues>({});

  // Get a runtime value by tab.
  const getRuntimeValue = (tabId: number) => runtimes[tabId];

  // Set a runtime value for a tab.
  const setRuntimeValue = (tabId: number, value: string) => {
    setRuntimeValues((prevState) => ({
      ...prevState,
      [tabId]: value,
    }));
  };

  // Store Genesis state values, keyed by tab.
  const [genesisStates, setGenesisStates] = useState<RuntimeValues>({});

  // Get a Genesis state value by tab.
  const getGenesisState = (tabId: number) => genesisStates[tabId];

  // Set a Genesis state value for a tab.
  const setGenesisState = (tabId: number, value: string) => {
    setGenesisStates((prevState) => ({
      ...prevState,
      [tabId]: value,
    }));
  };

  // Remove para id data for a tab.
  const removeTabParathreadData = (tabId: number) => {
    setRuntimeValues((prev) => {
      const updated = { ...prev };
      delete updated[tabId];
      return updated;
    });
    setGenesisStates((prev) => {
      const updated = { ...prev };
      delete updated[tabId];
      return updated;
    });
  };

  return (
    <RegisterParathreadContext.Provider
      value={{
        // WebAssembly runtime values.
        getRuntimeValue,
        setRuntimeValue,

        // Genesis state values,
        getGenesisState,
        setGenesisState,

        // Tab destroy state tidy up.
        removeTabParathreadData,
      }}
    >
      {children}
    </RegisterParathreadContext.Provider>
  );
};
