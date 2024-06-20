// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { InputArgs } from 'contexts/ChainUi/types';

// Formats a single argument for a query.
export const formatSingleArg = (
  formattedKeys: Record<string, AnyJson>,
  argValues: Record<string, string>
) => formatArg(formattedKeys[0], '1', argValues?.[0], argValues);

// Gets a collection of the longest keys in an inputKey field, fetching the deepest nested values in
// an input form.
export const getDeepestKeys = (inputKeys: Record<string, string>) => {
  const deepestKeys = Object.keys(inputKeys).reduce(
    (
      acc: {
        maxLength: number;
        keys: string[];
      },
      key: string
    ) => {
      if (key.length >= acc.maxLength) {
        acc = {
          maxLength: key.length,
          keys: acc.keys
            .filter((item) => item.length >= key.length)
            .concat(key),
        };
      }

      return acc;
    },
    {
      maxLength: 0,
      keys: [],
    }
  );

  return { deepestKeys: deepestKeys.keys, maxLength: deepestKeys.maxLength };
};

// Gets the value for each parent key for the provided input keys.
export const getParentKeyValues = (
  inputKeys: Record<string, string>,
  argValues: InputArgs,
  deepestKeys: Record<string, AnyJson>
) => {
  // Ensure deepest keys are ordered by key for correct passing of arguments order.
  const sortedDeepestKeys = Object.fromEntries(
    Object.entries(deepestKeys).sort(([a], [b]) => parseInt(a) - parseInt(b))
  );

  // Insert values for each respective each parent key.
  let parentKeys = Object.entries(sortedDeepestKeys).reduce(
    (acc: Record<string, AnyJson[]>, [key, type]) => {
      // Split key by underscore and remove the last element to get the parent key.
      const parentKey = key.split('_').slice(0, -1).join('_');

      // Get the current value of this parent key if it exists.
      const currentValue = acc[parentKey] || [];

      // The user inputted value for this key.
      const argValue = argValues[key];

      // Format current value based on its form input.
      const formattedValue = formatArg(type, key, argValue, argValues);

      // Accumulate current value to the parent key.
      acc[parentKey] = currentValue.concat(formattedValue);

      return acc;
    },
    {}
  );

  // Combine parent key type with their values.
  parentKeys = Object.entries(parentKeys).reduce(
    (acc: Record<string, AnyJson>, [key, value]) => {
      const parentInput = inputKeys[key];

      // If `Select` for possible typed enums, include the value in an array.
      const inputType =
        parentInput === 'Select' ? [parentInput, argValues[key]] : parentInput;

      // Format current value based on its form input.
      const formattedValue = formatArg(parentInput, key, value, argValues);
      acc[key] = [inputType, formattedValue];
      return acc;
    },
    {}
  );

  return parentKeys;
};

// Update input keys with values and delete corresponding child keys.
export const updateInputsAndRemoveChildren = (
  inputKeys: Record<string, AnyJson>,
  parentValues: Record<string, AnyJson>,
  deepestKeys: string[]
) => {
  // For each key of `parentValues` commit the value to `inputKeys` under the same
  // key.
  Object.entries(parentValues).forEach(([key, value]) => {
    inputKeys[key] = value;
  });
  // Delete each `deepestKeys` key from `inputKeys`.
  deepestKeys.forEach((key) => {
    delete inputKeys[key];
  });

  return inputKeys;
};

// Format an arg value.
export const formatArg = (
  type: string,
  key: string,
  value: AnyJson,
  argValues: AnyJson
) => {
  switch (type) {
    case 'AccountId32':
      return formatAccountId32(value);

    case 'Hash':
      return formatHash(value);

    case 'Bytes':
      return formatBytes(value);

    case 'Textbox':
      return formatText(value);

    case 'Checkbox':
      return formatCheckbox(value);

    case 'Select':
      return formatVariant(value, key, argValues);

    case 'Composite':
      return formatComposite(value);

    case 'Tuple':
      return formatTuple(value);

    // TODO: Sequences. Fall back to metadata for now.
    default:
      return {
        type,
        val: argValues?.[key],
        child: value,
      };
  }
};

// Format variant.
export const formatVariant = (
  value: AnyJson,
  key: string,
  argValues: AnyJson
) => {
  // TODO: get fields from class lookup data and format with typed or simple enum.
  const val = argValues?.[key];

  return {
    val,
    child: value,
  };
};

// Format composite: TODO: Implement field names for values.
export const formatComposite = (values: AnyJson[]): AnyJson[] => values;

// Format an account ID: Just return the string value.
export const formatAccountId32 = (value: string): string => value;

// Format a hash: Just return the string value.
export const formatHash = (value: string): string => value;

// Format bytes: Just return the string value.
export const formatBytes = (value: string): string => value;

// Format text: Just return the string value.
export const formatText = (value: string): string => value;

// Format checkbox: Just return the boolean value.
export const formatCheckbox = (value: boolean): boolean => value;

// Format tuple: Just return the array value.
export const formatTuple = (values: AnyJson[]): AnyJson[] => values;
