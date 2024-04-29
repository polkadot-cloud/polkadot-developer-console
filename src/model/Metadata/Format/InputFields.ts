// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { PalletItemScraped } from '../Scraper/types';

export class FormatInputFields {
  // The raw input config to format.
  #rawConfig: PalletItemScraped;

  constructor(rawConfig: PalletItemScraped) {
    this.#rawConfig = rawConfig;
  }

  // ------------------------------------------------------
  // Form input formatting.
  // ------------------------------------------------------

  // Formats `rawConfig` data into an input structure.
  format = () => {
    const {
      type: { argTypes },
    } = this.#rawConfig;

    // if there are no arg types, (no args to format) return an empty object.
    if (!argTypes) {
      return {};
    }

    // TODO: if arg types is an array, accumulate results.
    const result = this.getTypeInput(argTypes);
    return result;
  };

  // ------------------------------------------------------
  // Recursive input formatting.
  // ------------------------------------------------------

  // A recursive function that formats a call inputs.
  getTypeInput = (arg: AnyJson) => {
    const result: AnyJson = {};

    switch (arg?.type) {
      case 'array':
        result.array = {
          len: arg.array.len,
          form: this.getTypeInput(arg.array.type),
        };
        break;

      case 'bitSequence':
        result.bitSequence = {
          label: arg.label.short,
          // NOTE: Currently falling back to encoded hash until a custom input is created.
          form: 'Hash',
        };
        break;

      case 'compact':
        result.compact = {
          label: arg.compact.label,
          form: this.getTypeInput(arg.compact.type),
        };
        break;

      case 'composite':
        result.composite = this.getCompositeInput(arg);
        break;

      case 'primitive':
        result.primitive = {
          label: arg.label,
          // Treat unsigned integers as text inputs. NOTE: Could improve by allowing minus and
          // decimal in `number` input.
          form: ['char', 'str', 'i8', 'i16', 'i32', 'i64', 'i128'].includes(
            arg.label
          )
            ? 'text'
            : arg.label === 'bool'
              ? 'checkbox'
              : // Unsigned integers remain.
                'number',
        };
        break;

      case 'sequence':
        result.sequence = {
          label: arg.sequence.label,
          form: this.getTypeInput(arg.sequence.type),
        };
        break;

      case 'tuple':
        result.tuple = arg.tuple.map((item: AnyJson) =>
          this.getTypeInput(item)
        );
        break;

      case 'variant':
        result.variant = this.getVariantInput(arg);
        break;
    }

    return result;
  };

  // Formats a variant form input.
  getVariantInput(arg: AnyJson) {
    return {
      label: arg.label.short,
      form: 'select',
      forms: arg.variant.reduce((acc: AnyJson, { name, fields }: AnyJson) => {
        acc[name] = fields.map((field: AnyJson) =>
          this.getTypeInput(field.type)
        );
        return acc;
      }, {}),
    };
  }

  // Formats a composite form input.
  getCompositeInput(arg: AnyJson) {
    let shortLabel = arg.label.short;

    // If this composite is a sequence of u8s, then change the label to `Bytes`.
    if (this.checkCompositeIsBytes(shortLabel, arg)) {
      shortLabel = 'Bytes';
    }

    // Use a pre-defined custom input if the label matches. NOTE: Custom inputs will ignore the
    // composite type and stop the recursive input loop.
    const customInput = this.getCustomInput(shortLabel);

    const forms = customInput
      ? null
      : arg.composite.reduce(
          (acc: AnyJson, { name, typeName, type }: AnyJson) => {
            acc[name || typeName] = this.getTypeInput(type);
            return acc;
          },
          {}
        );

    return {
      label: shortLabel,
      form: customInput,
      forms,
    };
  }

  // ------------------------------------------------------
  // Custom input components.
  // ------------------------------------------------------

  // Get a custom input component based on label. Currently only called with composite types.
  //
  // CONTRIBUTE: Input types should be added to this switch statement, and in the `useInput` hook.
  getCustomInput = (label: string): string | null => {
    // If Vec parameter is u8, or BoundedVec parameter 2 is u8, then we are dealing with bytes.
    switch (label) {
      // Default Substrate AccountId type:
      // `<https://crates.parity.io/sp_runtime/struct.AccountId32.html>`;
      case 'AccountId32':
        return 'AccountId32';

      // Substrate Core primitive hash types: `<https://docs.rs/sp-core/latest/sp_core/index.html>`.
      case 'H160':
      case 'H256':
      case 'H512':
      case 'EthereumAddress': // Ethereum address hash.
        return 'Hash';

      // Types that result in a u8 array.
      case 'Bytes':
        return 'Bytes';
    }

    return null;
  };

  // ------------------------------------------------------
  // Helpers.
  // ------------------------------------------------------

  checkCompositeIsBytes(shortLabel: string, arg: AnyJson) {
    return (
      ['Vec', 'BoundedVec', 'WeakBoundedVec'].includes(shortLabel) &&
      arg.composite?.[0]?.type?.sequence?.label === 'u8' &&
      arg.composite?.length === 1
    );
  }

  // ------------------------------------------------------
  // Default input values.
  // ------------------------------------------------------

  static defaultValue(type: string): string {
    switch (type) {
      case 'number':
        return '0';

      case 'char':
      case 'str':
        return '';

      default:
        return '';
    }
  }
}
