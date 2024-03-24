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
        // TODO: implement.
        result.bitSequence = {
          label: arg.label.short,
          form: null,
        };
        break;

      case 'compact':
        result.compact = {
          label: arg.label,
          form: this.getTypeInput(arg.compact.type),
        };
        break;

      case 'composite':
        result.composite = this.getCompositeInput(arg);
        break;

      case 'primitive':
        result.primitive = {
          label: arg.label,
          // TODO: if char or str, set form to 'text'.
          form: 'number',
        };
        break;

      case 'sequence':
        // TODO: implement.
        result.sequence = {
          label: arg.label,
          form: null,
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
    return {
      label: arg.label.short,
      form: null,
      forms: arg.composite.reduce((acc: AnyJson, { name, type }: AnyJson) => {
        acc[name] = this.getTypeInput(type);
        return acc;
      }, {}),
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
