// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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

  return deepestKeys.keys;
};
