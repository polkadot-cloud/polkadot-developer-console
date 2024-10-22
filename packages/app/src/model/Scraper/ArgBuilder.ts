// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { AnyJson } from '@w3ux/types';
import type { InputArgs } from 'contexts/ChainUi/types';
import type { InputMeta } from 'routes/Chain/Inputs/types';
import type { PalletScraper } from './Pallet';
import type { CompositeType } from './Types/Composite';
import type { VariantType } from './Types/Variant';
import { getParentKey } from './Utils';

// A class to take input keys and values, and formats them into a submittable array of arguments.
export class ArgBuilder {
  // Form input meta.
  inputMeta: InputMeta;

  // The resulting formatted arguments.
  formattedArgs: Record<string, AnyJson>;

  // The scraper associated with this input form.
  scraper: PalletScraper;

  constructor(
    inputArgs: InputArgs | null,
    inputMeta: InputMeta,
    scraper: PalletScraper
  ) {
    this.inputMeta = inputMeta;
    this.formattedArgs = { ...(inputArgs || {}) };
    this.scraper = scraper;

    // console.log({ ...inputArgs });
    // console.log({ ...inputMeta });
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
    let i = 0;
    do {
      console.debug('iteration', i);

      // If up to top level arguments, format values and exit.
      if (maxLength === 1) {
        this.formattedArgs = Object.entries(this.formattedArgs).reduce(
          (acc: Record<string, AnyJson>, [key, arg]) => {
            // If we've reached one top level argument but they haven't been formatted, return the
            // inner value, otherwise return the formatted arg.
            if ('value' in arg) {
              acc[key] = arg?.value || '';
            } else {
              acc[key] = arg || '';
            }
            return acc;
          },
          {}
        );
        break;
      }

      // Take the values of deepest keys. As deepest values are usually primitive types, the deepest
      // keys should always return a value - not a composite or typed variant.
      const deepestKeysWithValue = Object.fromEntries(
        deepestKeys.map((key) => [key, this.formattedArgs[key]])
      );

      // Get parent keys of deepest keys along with their type and value.
      const parentKeysWithValue =
        this.buildParentKeyValues(deepestKeysWithValue);

      // For each key of `parentValues` commit the value to `formattedArgs` under the same key, and
      // delete the processed deepest keys.
      this.formatParentValuesAndRemoveChildren(
        parentKeysWithValue,
        deepestKeys
      );

      // Update `deepestKeys` and `maxLength` for next iteration.
      const newDeepestKeys = this.getDeepestKeys();
      deepestKeys = newDeepestKeys.deepestKeys;
      maxLength = newDeepestKeys.maxLength;

      i++;
    } while (deepestKeys.length >= 1);

    // If extrinsic args are being formatted, collate arguments into a single array.
    if (Object.keys(this.formattedArgs).length > 1) {
      return { 0: Object.values(this.formattedArgs) };
    }

    return this.formattedArgs;
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

  // Build the values of each parent key for the provided input keys.
  //
  // 1: Collects the deepest keys and their values, and concatenates these values to the parent
  // keys.
  // 2: Reformats the newly formed parent keys by combining its type with its formatted
  // values.
  buildParentKeyValues(deepestKeyValues: Record<string, AnyJson>) {
    const sortedDeepestKeys = Object.keys(deepestKeyValues)
      .sort()
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: deepestKeyValues[key],
        }),
        {}
      );

    // Concatenate deepest key values to each corresponding parent key.
    const parentKeysWithValues = Object.entries(sortedDeepestKeys).reduce(
      (acc: Record<string, AnyJson[]>, [key]) => {
        // Get parent index key.
        const parentKey = getParentKey(key);

        // Get the current value of this parent key if it exists.
        const currentValue = acc[parentKey] || [];

        // Concatenate value to parent key.
        acc[parentKey] = currentValue.concat(this.formattedArgs[key]);

        return acc;
      },
      {}
    );

    // Add parent key type to newly combined `parentKeyWithValues` entries.
    const parentKeys = Object.entries(parentKeysWithValues).reduce(
      (acc: Record<string, AnyJson>, [key, value]) => {
        const parentInputType = this.inputMeta[key].inputType;

        // If `Select` for possible typed enums, include the value in an array.
        const inputType =
          parentInputType === 'variant'
            ? [parentInputType, this.formattedArgs[key]?.value]
            : parentInputType;

        acc[key] = [inputType, value];
        return acc;
      },
      {}
    );
    return parentKeys;
  }

  // Update accumulated parent keys with their actual values and delete corresponding child keys.
  formatParentValuesAndRemoveChildren(
    parentValues: Record<string, AnyJson>,
    deepestKeys: string[]
  ) {
    // For each key of `parentValues` commit the arg to `formattedArgs` under the same
    // key.
    Object.entries(parentValues).forEach(([inputKey, value]) => {
      this.formattedArgs[inputKey] = this.formatInput(inputKey, value);
    });

    // Delete this iteration of deepest keys from `inputMeta` and `formattedArgs`.
    deepestKeys.forEach((key) => {
      delete this.inputMeta[key];
      delete this.formattedArgs[key];
    });
  }

  // Formats an accumulated parent key input.
  formatInput(inputKey: string, [inputType, entries]: AnyJson) {
    const indexKey = this.inputMeta[inputKey].indexKey;

    // If array (enum with value), get the first element of the array as the input type.
    let selectedValue = undefined;
    if (Array.isArray(inputType)) {
      selectedValue = inputType[1];
      inputType = inputType[0];
    }

    switch (inputType) {
      case 'compact':
        return this.formatCompact(entries);

      case 'composite':
        return this.formatComposite(entries, indexKey);

      case 'variant':
        return this.formatVariant(entries, indexKey, selectedValue);

      case 'sequence':
        // NOTE: Wrapping entries in an array here.
        return [entries?.map((val: AnyJson) => val.value)];

      default:
        // Default behaviour: Return inner values in an array.
        return entries?.map((val: AnyJson) => val.value);
    }
  }

  // Format a variant input value. Select the correct variant item based on the input value, and
  // then format fields based on provided entries. Should simply return its value if its a simple
  // variant. (no fields).
  formatVariant(entries: AnyJson, indexKey: string, selectedValue: string) {
    const typeClass = this.scraper.getClass(indexKey) as VariantType;
    const items = typeClass.items;
    const selectedItem = items.find((item) => item.name === selectedValue);

    // Simply return the selected value if this enum has no fields.
    if (!selectedItem?.fields) {
      return selectedValue;
    }

    // Check if variant fields are of tuple or named field map.
    const isTuple = selectedItem.fields.every(({ name }) => name === null);

    // Build resulting value from entries and variant type.
    let result;
    if (isTuple) {
      // Enum with unamed fields.
      result = {
        [selectedValue]:
          // If only one entry, return it directly.
          entries.length === 1
            ? entries[0]
            : // If multiple entries, return them as an array.
              entries.map((entry: AnyJson) => entry),
      };
    } else {
      // Enum with named fields.
      result = {
        [selectedValue]: selectedItem.fields.reduce(
          (acc: AnyJson, { name }, i) => {
            acc[name] = entries[i];
            return acc;
          },
          {}
        ),
      };
    }
    return result;
  }

  // Format a composite input value. Accumulate composite fields and value entires into an object.
  formatComposite(entries: AnyJson, indexKey: string) {
    const typeClass = this.scraper.getClass(indexKey) as CompositeType;
    const fields = typeClass.fields;

    // if a field does not have a name, this composite type should be treated as a tuple.
    const isTuple = fields.every(({ name }) => name === null);

    let result;
    if (isTuple) {
      result =
        entries.length === 1
          ? // If only one entry, return it directly.
            entries[0]
          : // If multiple entries, return them as an array.
            entries.map(({ value }: { value: string }) => value);
    } else {
      // Names present - format object with names as keys.
      result = fields.reduce((acc: AnyJson, { name }, i) => {
        acc[name] = entries[i].value;
        return acc;
      }, {});
    }

    return result;
  }

  // Format a compact input value. Simply unwrap if it is an array of > 1 value, otherwise return.
  formatCompact(entries: AnyJson) {
    if (!Array.isArray(entries)) {
      return entries;
    }

    if (entries.length === 1) {
      return entries[0];
    }

    return entries;
  }
}
