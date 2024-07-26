// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { PalletItemScraped, ScrapedFieldItem, ScrapedItem } from './types';
import { verifyOption } from './Utils';
import type { MetadataScraper } from '.';

export class FormatCallSignature {
  // The scraper associated with this formatter.
  scraper: MetadataScraper;

  // The raw input config to format.
  #rawConfig: PalletItemScraped;

  // Type labels to ignore when formatting call signatures.
  #ignoreLabels = ['BoundedVec', 'WeakBoundedVec'];

  constructor(rawConfig: PalletItemScraped, scraper: MetadataScraper) {
    this.#rawConfig = rawConfig;
    this.scraper = scraper;
  }

  // ------------------------------------------------------
  // Call signature formatting.
  // ------------------------------------------------------

  // Formats `rawConfig` data into a string.
  format = () => {
    const { modifier, argTypes, returnType } = this.#rawConfig;

    // Format arguments and return types.
    const [argFormatted, returnFormatted] = [argTypes, returnType].map((arg) =>
      this.getTypeString(arg)
    );

    // Format the call signature based on formatted types and modifier.
    const callSig = `${this.formatArgType(argFormatted)}${this.formatReturnType(returnFormatted, modifier)}`;
    return callSig;
  };

  // Formats call argument type.
  formatArgType = (argType: string) => {
    let str = '';

    // Return early if we are dealing with runtime constants to avoid wrapping in parens. NOTE: Only
    // runtime constants have a `value` field.
    if (this.#rawConfig.value !== undefined) {
      return str;
    }

    if (argType !== '') {
      // Check if arguments are already wrapped in parens, and to do so if not.
      if (!/^\(.*\)$/.test(argType)) {
        str = `(${argType})`;
      } else {
        str = `${argType}`;
      }
    } else {
      str = '()';
    }
    return str;
  };

  // Formats a return type, adding `Option` if the modifier is `Optional`.
  formatReturnType = (returnType: string, modifier: string) => {
    let str = '';
    if (returnType !== '') {
      str += ': ';

      if (modifier === 'Optional') {
        str += `Option<${returnType}>`;
      } else {
        str += returnType;
      }
    }
    return str;
  };

  // ------------------------------------------------------
  // Recursive type formatting.
  // ------------------------------------------------------

  // A recursive function that formats a call signature by formatting its arguments and return
  // types.
  getTypeString = (arg: ScrapedItem) => {
    let str = '';

    // Defensive. If class is not indexed, return empty string.
    if (!arg?.indexKey) {
      return '';
    }

    const { indexKey } = arg;
    const typeClass = this.scraper.getClass(indexKey);

    switch (typeClass.type) {
      case 'array':
        str = this.getTypeString(arg.array.type);
        break;

      case 'compact':
        str = this.getTypeString(arg.compact);
        break;

      case 'composite':
        str = this.getCompositeString(arg);
        break;

      case 'primitive':
        str = typeClass.label;
        break;

      case 'bitSequence':
        str = typeClass.label;
        break;

      case 'sequence':
        str = `Vec<${this.getTypeString(arg.sequence)}>`;
        break;

      case 'tuple':
        str = this.getTupleString(arg);
        break;

      case 'variant':
        str = this.getVariantType(arg);
        break;

      default:
        str = '';
    }

    return str;
  };

  // Formats a string from a composite type.
  getCompositeString = (arg: ScrapedItem) => {
    const typeClass = this.scraper.getClass(arg.indexKey);
    const label = typeClass.label;

    let str = '';
    // Expand type if short label is not defined, or if they've been defined in ignore list.
    if (['', ...this.#ignoreLabels].includes(label)) {
      str += arg.composite.reduce(
        (acc: string, field: ScrapedFieldItem, index: number) => {
          acc = acc + this.getTypeString(field);
          if (index < arg.composite.length - 1) {
            acc += ', ';
          }
          return acc;
        },
        ''
      );
    } else {
      str = `${label}`;
    }

    return str;
  };

  // Formats a string from a variant type.
  getVariantType = (arg: ScrapedItem) => {
    const typeClass = this.scraper.getClass(arg.indexKey);
    const label = typeClass.label;

    let str = `${label}`;

    // If variant is `Option`, expand signature with its `Some` type.
    if (verifyOption(label, arg.variant)) {
      str +=
        arg.variant[1].fields.reduce(
          (acc: string, field: ScrapedFieldItem, index: number) => {
            acc = acc + this.getTypeString(field);
            if (index < arg.variant[1].fields.length - 1) {
              acc += ', ';
            }
            return acc;
          },
          `<`
        ) + `>`;
    }

    return str;
  };

  // Formats a string from a tuple type.
  getTupleString = ({ tuple }: ScrapedItem) =>
    tuple.reduce((acc: string, subSection: ScrapedItem, index: number) => {
      const sigType = this.getTypeString(subSection);
      acc += sigType;
      if (index !== tuple.length - 1) {
        acc += ', ';
      }
      return acc;
    }, '');
}
