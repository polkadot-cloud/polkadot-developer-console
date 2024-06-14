// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { createContext, useContext, useRef } from 'react';
import { defaultInputFormContext } from './defaults';
import type {
  InputFormContextInterface,
  InputFormProviderProps,
} from './types';
import {
  formatArg,
  getDeepestKeys,
  getParentKeyValues,
  updateInputsAndRemoveChildren,
} from './Utils';
import { useActiveTab } from 'contexts/ActiveTab';
import { useChainUi } from 'contexts/ChainUi';
import type { AnyJson } from '@w3ux/types';

export const InputForm = createContext<InputFormContextInterface>(
  defaultInputFormContext
);

export const useInputForm = () => useContext(InputForm);

export const InputFormProvider = ({
  namespace,
  children,
}: InputFormProviderProps) => {
  const { tabId } = useActiveTab();
  const { getInputArgs } = useChainUi();

  // A reference to accumulate input keys for an input form.
  const inputKeysRef = useRef<Record<string, string>>({});

  // Handle query submission. Accumulates input values and passes them into the provided `onSubmit`
  // function.
  const handleSubmit = (onSubmit?: (inputArgs: AnyJson) => void) => {
    // Get input keys for manipulation.
    let inputKeys = { ...inputKeysRef.current } as Record<string, AnyJson>;
    const argValues = getInputArgs(tabId, namespace);

    // Gets the deepest keys of inputKeys object. There could be more than 1 key with the
    // longest length.
    let { deepestKeys, maxLength } = getDeepestKeys(inputKeys);

    // Recursively construct input values.
    do {
      // Take the values of those deepest keys.
      const deepestKeysWithValue = Object.fromEntries(
        deepestKeys.map((key) => [key, inputKeys[key]])
      );

      // Exit early if deepest key is only 1.
      if (maxLength === 1) {
        inputKeys[1] = formatArg(inputKeys[1], '1', argValues?.[1], argValues);
        break;
      }

      // Get parent keys of deepest keys.
      const parentValues = getParentKeyValues(
        inputKeys,
        argValues || {},
        deepestKeysWithValue
      );

      // For each key of `parentValues` commit the value to `inputKeys` under the same
      // key.
      inputKeys = updateInputsAndRemoveChildren(
        inputKeys,
        parentValues,
        deepestKeys
      );

      // Update `deepestKeys` for next iteration.
      const newDeepestKeys = getDeepestKeys(inputKeys);
      deepestKeys = newDeepestKeys.deepestKeys;
      maxLength = newDeepestKeys.maxLength;
    } while (deepestKeys.length > 1);

    // Determine whether inputs are empty.
    const isEmpty = Object.values(inputKeys).length === 0;

    // Determine whether there is a single argument or a tuple of arguments.
    const isTuple = Array.isArray(inputKeys[1]);

    // Take the resulting arguments for query submission. If there are no inputs, no
    // arguments are needed for the query.
    const resultInput = isEmpty
      ? null
      : isTuple
        ? Object.values(inputKeys)?.[0][1]
        : Object.values(inputKeys)?.[0];

    // Call a submission function if it exists.
    if (typeof onSubmit === 'function') {
      onSubmit(resultInput);
    }

    // console.log('---');
    // console.log(resultInput);

    return resultInput;
  };

  return (
    <InputForm.Provider
      value={{
        namespace,
        inputKeysRef,
        handleSubmit,
      }}
    >
      {children}
    </InputForm.Provider>
  );
};
