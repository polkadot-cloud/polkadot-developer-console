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
  // Call signature formatting.
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
    // console.log(argTypes);
    // console.log(result);
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
          label: arg.label,
          form: this.getTypeInput(arg.array.type),
        };
        break;

      case 'bitSequence':
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
        result.composite = {
          label: arg.label.short,
          form: null,
        };
        break;

      case 'primitive':
        result.primitive = {
          label: arg.label,
          form: 'number',
        };
        break;

      case 'sequence':
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
        result.variant = {
          label: arg.label.short,
          form: this.getTypeInput(arg.variant),
        };

        break;
    }
    return result;
  };

  // ------------------------------------------------------
  // Default input values.
  // ------------------------------------------------------

  static defaultValue(type: string): string | number | null {
    switch (type) {
      case 'number':
        return '0';

      case 'char':
      case 'str':
        return '';

      default:
        return null;
    }
  }
}
