// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { InputArgs } from 'contexts/ChainUi/types';

// A class to take input keys and values, and formats them into a submittable array of arguments.
export class ArgBuilder {
  // The input arguments to be formatted.
  inputArgs: InputArgs;

  // The resulting formatted arguments.
  formattedArgs: Record<string, AnyJson>;

  constructor(inputArgs: InputArgs | null) {
    this.inputArgs = inputArgs || {};
    this.formattedArgs = inputArgs || {};
  }

  // ------------------------------------------------------
  // Formatter.
  // ------------------------------------------------------

  // Recursively accumulate formatted args from input args.
  start() {
    // If no input args exist, no formatting is necessary.
    if (this.inputArgs === null) {
      return;
    }

    const { deepestKeys, maxLength } = this.getDeepestKeys();

    // Accumulate formatted args.
    do {
      // If only a single input to process, format it and exit early.
      if (maxLength === 1) {
        this.formattedArgs[0] = this.formatInput('0');
        break;
      }

      // Take the values of deepest keys.
      const deepestKeysWithValue = Object.fromEntries(
        deepestKeys.map((key) => [key, this.formattedArgs[key]])
      );

      // TODO: Implement.
      console.debug(deepestKeysWithValue);
      break;
    } while (deepestKeys.length > 1);
  }

  // Formats an input arg value.
  formatInput(key: string) {
    const inputType = this.formattedArgs[key];
    const value = this.inputArgs[key]?.arg;

    switch (inputType) {
      case 'AccountId32':
        return value;

      case 'Hash':
        return value;

      case 'Bytes':
        return value;

      case 'Textbox':
        return value;

      case 'Checkbox':
        return value;

      case 'Tuple':
        return value;

      // TODO: Sequences, Variants, Composites. Fall back to metadata for now.
      default:
        return {
          inputType,
          val: this.inputArgs?.[key]?.arg,
          child: value,
        };
    }
  }

  // ------------------------------------------------------
  // Utilities.
  // ------------------------------------------------------

  // Gets a collection of the longest keys present in `formattedArgs`. This is the equivalent of
  // fetching the deepest nested values in the input form.
  getDeepestKeys = () => {
    const { keys, maxLength } = Object.keys(this.formattedArgs).reduce(
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

    return { deepestKeys: keys, maxLength };
  };
}
