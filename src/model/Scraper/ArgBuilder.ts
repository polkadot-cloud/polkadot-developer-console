// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { InputArgs } from 'contexts/ChainUi/types';

// A class to take input keys and values, and formats them into a submittable array of arguments.
export class ArgBuilder {
  // Form input keys.
  inputKeys: Record<string, string>;

  // The resulting formatted arguments.
  formattedArgs: Record<string, AnyJson>;

  constructor(inputArgs: InputArgs | null, inputKeys: Record<string, string>) {
    this.inputKeys = inputKeys;
    this.formattedArgs = { ...inputArgs } || {};
  }

  // ------------------------------------------------------
  // Build args.
  // ------------------------------------------------------

  // Recursively accumulate formatted args from input keys and args.
  build() {
    // If no input args exist, no formatting is necessary.
    if (Object.keys(this.formattedArgs).length === 0) {
      return {};
    }

    let { deepestKeys, maxLength } = this.getDeepestKeys();
    // Accumulate formatted args.
    do {
      // If only a single input to process, format it and exit early.
      if (maxLength === 1) {
        this.formattedArgs[0] = this.formatInput(
          '0',
          this.formattedArgs['0']?.value
        );
        break;
      }

      // Take the values of deepest keys.
      const deepestKeysWithValue = Object.fromEntries(
        deepestKeys.map((key) => [key, this.formattedArgs[key]])
      );

      // Get parent keys of deepest keys.
      const parentValues = this.buildParentKeyValues(deepestKeysWithValue);

      // For each key of `parentValues` commit the value to `formattedArgs` under the same key, and
      // delete the processed deepest keys.
      this.updateInputsAndRemoveChildren(parentValues, deepestKeys);

      // Update `deepestKeys` and `maxLength` for next iteration.
      const newDeepestKeys = this.getDeepestKeys();
      deepestKeys = newDeepestKeys.deepestKeys;
      maxLength = newDeepestKeys.maxLength;
    } while (deepestKeys.length > 1);

    return this.formattedArgs;
  }

  // Formats an input arg value.
  formatInput(key: string, value: AnyJson) {
    const inputType = this.inputKeys[key];
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
          type: inputType,
          val: this.formattedArgs?.[key]?.value,
          child: value,
        };
    }
  }

  // Build the values of each parent key for the provided input keys.
  //
  // 1: Collects the deepest keys and their values, and concatenates these values to the parent keys.
  // 2: Reformats the newly formed parent keys by combining its type with its formatted values.
  buildParentKeyValues(deepestKeys: Record<string, AnyJson>) {
    // Ensure deepest keys are ordered by key for correct passing of arguments order.
    const sortedDeepestKeys = Object.fromEntries(
      Object.entries(deepestKeys).sort(([a], [b]) => parseInt(a) - parseInt(b))
    );

    // Concatenate deepest key values to each corresponding parent key.
    const parentKeysWithValues = Object.entries(sortedDeepestKeys).reduce(
      (acc: Record<string, AnyJson[]>, [key]) => {
        // Split key by underscore and remove the last element to get the parent key.
        const parentKey = key.split('_').slice(0, -1).join('_');

        // Get the current value of this parent key if it exists.
        const currentValue = acc[parentKey] || [];

        // Format arg value based on its form input.
        const formattedValue = this.formatInput(
          key,
          this.formattedArgs[key]?.value
        );

        // Concatenate value to parent key.
        acc[parentKey] = currentValue.concat(formattedValue);

        return acc;
      },
      {}
    );

    // Combine parent key type with the formatted values.
    const parentKeys = Object.entries(parentKeysWithValues).reduce(
      (acc: Record<string, AnyJson>, [key, value]) => {
        const parentInputType = this.inputKeys[key];

        // If `Select` for possible typed enums, include the value in an array.
        const inputType =
          parentInputType === 'Select'
            ? [parentInputType, this.formattedArgs[key]?.value]
            : parentInputType;

        // Format current value based on its form input.
        const formattedValue = this.formatInput(key, value);

        acc[key] = [inputType, formattedValue];
        return acc;
      },
      {}
    );
    return parentKeys;
  }

  // Update input keys with values and delete corresponding child keys.
  updateInputsAndRemoveChildren(
    parentValues: Record<string, AnyJson>,
    deepestKeys: string[]
  ) {
    // For each key of `parentValues` commit the arg to `formattedArgs` under the same
    // key.
    Object.entries(parentValues).forEach(([key, value]) => {
      this.formattedArgs[key] = value;
    });

    // Delete this iteration of deepest keys from `inputKeys` and `formattedArgs`.
    deepestKeys.forEach((key) => {
      delete this.inputKeys[key];
      delete this.formattedArgs[key];
    });
  }

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
