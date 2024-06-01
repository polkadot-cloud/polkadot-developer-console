// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { InputArgs } from 'contexts/ChainUi/types';

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

      // Accumulate current value to the parent key.
      acc[parentKey] = currentValue.concat({
        type,
        val: argValues[key],
      });

      return acc;
    },
    {}
  );

  // Combine parent key type with their values.
  parentKeys = Object.entries(parentKeys).reduce(
    (acc: Record<string, AnyJson[]>, [key, value]) => {
      const parentInput = inputKeys[key];
      acc[key] = [parentInput, value];
      return acc;
    },
    {}
  );

  return parentKeys;
};
