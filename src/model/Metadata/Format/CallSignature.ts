// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { PalletItemScraped } from '../Scraper/types';

export class FormatCallSignature {
  // The raw input config to format.
  #rawConfig: PalletItemScraped;

  // Type labels to ignore when formatting call signatures.
  #ignoreLabels = ['BoundedVec', 'WeakBoundedVec'];

  constructor(rawConfig: PalletItemScraped) {
    this.#rawConfig = rawConfig;
  }

  // ------------------------------------------------------
  // Call signature formatting.
  // ------------------------------------------------------

  // Formats `rawConfig` data into a string.
  format = () => {
    const {
      modifier,
      type: { argTypes, returnType },
    } = this.#rawConfig;

    // Format arguments and return types.
    const [argFormatted, returnFormatted] = [argTypes, returnType].map(
      (section) => this.getTypeString(section)
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
  getTypeString = (section: AnyJson) => {
    let str = '';

    switch (section?.type) {
      case 'array':
        str = this.getTypeString(section.array.type);
        break;

      case 'compact':
        str = this.getTypeString(section.sequence);
        break;

      case 'composite':
        str = this.getCompositeString(section);
        break;

      case 'primitive':
      case 'bitSequence':
        str = this.getShortLabel(section.label);
        break;

      case 'sequence':
        str = `Vec<${this.getTypeString(section.sequence)}>`;
        break;

      case 'tuple':
        str = this.getTupleString(section);
        break;

      case 'variant':
        str = this.getVariantType(section);
        break;
    }
    return str;
  };

  // Formats a string from a composite type.
  getCompositeString = ({ composite, label }: AnyJson) => {
    let str = '';

    // Expand type if short label is not defined, or if they've been defined in ignore list.
    if (['', ...this.#ignoreLabels].includes(label.short)) {
      str += composite.reduce((acc: string, field: AnyJson, index: number) => {
        // Defensive: return if field type is missing.
        if (!field?.type) {
          return '';
        }
        acc = acc + this.getTypeString(field.type);
        if (index < composite.length - 1) {
          acc += ', ';
        }
        return acc;
      }, '');
    } else {
      str = `${label.short}`;
    }

    return str;
  };

  // Formats a string from a variant type.
  getVariantType = ({ variant, label }: AnyJson) => {
    let str = `${label.short}`;

    // If variant is `Option`, expand signature with its `Some` type.
    if (this.verifyOption(label.short, variant)) {
      str +=
        variant[1].fields.reduce(
          (acc: string, field: AnyJson, index: number) => {
            acc = acc + this.getTypeString(field.type);
            if (index < variant[1].fields.length - 1) {
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
  getTupleString = ({ tuple }: AnyJson) =>
    tuple.reduce((acc: string, subSection: AnyJson, index: number) => {
      const sigType = this.getTypeString(subSection);
      acc += sigType;
      if (index !== tuple.length - 1) {
        acc += ', ';
      }
      return acc;
    }, '');

  // ------------------------------------------------------
  // Class helpers
  // ------------------------------------------------------

  // Gets a short label from a label input.
  getShortLabel = (input: string | { long: string; short: string }) =>
    typeof input === 'string' ? input : input.short;

  // Gets a long label from a label input.
  getLongLabel = (input: string | { long: string; short: string }) =>
    typeof input === 'string' ? input : input.long;

  // Verify if a variant is an Option.
  verifyOption = (shortLabel: string, variant: { name?: string }[]) =>
    shortLabel === 'Option' &&
    variant?.[0]?.name === 'None' &&
    variant?.[1]?.name === 'Some';
}
