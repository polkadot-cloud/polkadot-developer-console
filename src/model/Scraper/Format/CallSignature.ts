// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';
import type { PalletItemScraped } from '../types';
import { getShortLabel, verifyOption } from './Utils';

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
  getTypeString = (arg: AnyJson) => {
    const type = arg?.class?.type;

    let str = '';

    switch (type) {
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
        str = arg.class.label();
        break;

      case 'bitSequence':
        str = getShortLabel(arg.class.label());
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
    }
    return str;
  };

  // Formats a string from a composite type.
  getCompositeString = (arg: AnyJson) => {
    let str = '';
    const shortLabel = getShortLabel(arg.class.label());

    // Expand type if short label is not defined, or if they've been defined in ignore list.
    if (['', ...this.#ignoreLabels].includes(shortLabel)) {
      str += arg.composite.reduce(
        (acc: string, field: AnyJson, index: number) => {
          // Defensive: return if field type is missing.
          if (!field?.type) {
            return '';
          }
          acc = acc + this.getTypeString(field.type);
          if (index < arg.composite.length - 1) {
            acc += ', ';
          }
          return acc;
        },
        ''
      );
    } else {
      str = `${shortLabel}`;
    }

    return str;
  };

  // Formats a string from a variant type.
  getVariantType = (arg: AnyJson) => {
    const shortLabel = getShortLabel(arg.class.label());

    let str = `${shortLabel}`;

    // If variant is `Option`, expand signature with its `Some` type.
    if (verifyOption(shortLabel, arg.variant)) {
      str +=
        arg.variant[1].fields.reduce(
          (acc: string, field: AnyJson, index: number) => {
            acc = acc + this.getTypeString(field.type);
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
  getTupleString = ({ tuple }: AnyJson) =>
    tuple.reduce((acc: string, subSection: AnyJson, index: number) => {
      const sigType = this.getTypeString(subSection);
      acc += sigType;
      if (index !== tuple.length - 1) {
        acc += ', ';
      }
      return acc;
    }, '');
}
