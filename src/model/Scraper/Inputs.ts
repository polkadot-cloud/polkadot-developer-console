// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { PalletItemScraped } from './types';
import { checkCompositeIsBytes, getCustomInput } from './Utils';

export class Inputs {
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
    let { argTypes } = this.#rawConfig;

    // if there are no arg types, (no args to format) return an empty object.
    if (!argTypes) {
      return {};
    }

    if (!Array.isArray(argTypes)) {
      argTypes = [argTypes];
    }

    return argTypes.map((argType: AnyJson) => this.getTypeInput(argType));
  };

  // ------------------------------------------------------
  // Recursive input formatting.
  // ------------------------------------------------------

  // A recursive function that formats a call inputs.
  getTypeInput = (arg: AnyJson) => {
    const type = arg?.class?.type;

    const result: AnyJson = {};

    // If the type is not defined, return an empty object.
    if (!arg?.[type]) {
      return null;
    }

    switch (type) {
      case 'array':
        result.array = {
          len: arg.array.len,
          form: this.getTypeInput(arg.array.type),
        };
        break;

      case 'bitSequence':
        result.bitSequence = {
          label: arg.class.label(),
          // NOTE: Currently falling back to encoded hash until a custom input is created.
          form: 'Hash',
        };
        break;

      case 'compact':
        result.compact = {
          label: arg.compact.class.label(),
          form: this.getTypeInput(arg.compact),
        };
        break;

      case 'composite':
        result.composite = this.getCompositeInput(arg);
        break;

      case 'primitive':
        result.primitive = {
          label: arg.class.label(),
          // Treat unsigned integers as text inputs. NOTE: Could improve by allowing minus and
          // decimal in `number` input.
          form: [
            'char',
            'str',
            'i8',
            'i16',
            'i32',
            'i64',
            'i128',
            'u8',
            'u16',
            'u32',
            'u64',
            'u128',
          ].includes(arg.class.label())
            ? 'text'
            : arg.class.label() === 'bool'
              ? 'checkbox'
              : // Unsigned integers remain.
                'number',
        };
        break;

      case 'sequence':
        result.sequence = {
          label: arg.sequence.class.label(),
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
    const label = arg.class.label();

    return {
      label,
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
    let label = arg.class.label();

    // If this composite is a sequence of u8s, then change the label to `Bytes`.
    if (checkCompositeIsBytes(label, arg)) {
      label = 'Bytes';
    }

    // Use a pre-defined custom input if the label matches. NOTE: Custom inputs will ignore the
    // composite type and stop the recursive input loop.
    const customInput = getCustomInput(label);

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
      label,
      form: customInput,
      forms,
    };
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
