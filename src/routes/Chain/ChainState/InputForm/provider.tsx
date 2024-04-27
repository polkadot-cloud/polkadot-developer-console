// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useRef } from 'react';
import { defaultInputFormContext } from './defaults';
import type {
  InputFormContextInterface,
  InputFormProviderProps,
} from './types';

export const InputForm = createContext<InputFormContextInterface>(
  defaultInputFormContext
);

export const useInputForm = () => useContext(InputForm);

export const InputFormProvider = ({
  inputArgsFor,
  children,
}: InputFormProviderProps) => {
  // A reference to accumulate input keys for an input form.
  const inputKeysRef = useRef<Record<string, string>>({});

  return (
    <InputForm.Provider
      value={{
        inputArgsFor,
        inputKeysRef,
      }}
    >
      {children}
    </InputForm.Provider>
  );
};
