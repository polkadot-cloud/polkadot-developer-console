// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext } from 'react';
import { defaultInputFormContext } from './defaults';
import type {
  InputFormContextInterface,
  InputFormProviderProps,
} from './types';

import { useActiveTab } from 'contexts/ActiveTab';
import { useChainUi } from 'contexts/ChainUi';
import type { AnyJson } from '@w3ux/types';
import { ArgBuilder } from 'model/Scraper/ArgBuilder';

export const InputForm = createContext<InputFormContextInterface>(
  defaultInputFormContext
);

export const useInputForm = () => useContext(InputForm);

export const InputFormProvider = ({
  namespace,
  children,
  scraper,
}: InputFormProviderProps) => {
  const { tabId } = useActiveTab();
  const { getInputArgs } = useChainUi();

  // A reference to accumulate input keys for an input form.
  const inputKeys: Record<string, string> = {};

  // Handle query submission. Accumulates input values and passes them into the provided `onSubmit`
  // function.
  const handleSubmit = (onSubmit?: (args: AnyJson) => void) => {
    // Exit early if no scraper is present.
    if (!scraper) {
      return;
    }

    // Get input keys for manipulation.
    let formattedInputs = { ...inputKeys } as Record<string, AnyJson>;
    const inputArgs = getInputArgs(tabId, namespace);

    if (inputArgs === null) {
      formattedInputs = {};
    } else {
      // Format input arguments.
      formattedInputs = new ArgBuilder(inputArgs, inputKeys).build();
    }

    // Determine whether inputs are empty.
    const isEmpty = Object.values(formattedInputs).length === 0;

    // Determine whether there is a single argument or a tuple of arguments.
    const isTuple = Object.values(formattedInputs)?.[0]?.[0] === 'Tuple';

    // Take the resulting arguments for query submission. If there are no inputs, no
    // arguments are needed for the query.
    const resultInput = isEmpty
      ? null
      : isTuple
        ? Object.values(formattedInputs)?.[0][1]
        : Object.values(formattedInputs)?.[0];

    console.log('---');
    console.log(resultInput);

    // Call a submission function if it exists.
    if (typeof onSubmit === 'function') {
      onSubmit(resultInput);
    }

    return resultInput;
  };

  return (
    <InputForm.Provider
      value={{
        namespace,
        inputKeys,
        handleSubmit,
      }}
    >
      {children}
    </InputForm.Provider>
  );
};
