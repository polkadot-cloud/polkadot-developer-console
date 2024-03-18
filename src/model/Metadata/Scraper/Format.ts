// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';

// A static class for formatting values into string representation.

export class Format {
  // ------------------------------------------------------
  // Fields.
  // ------------------------------------------------------

  // Format field names into a human readable comma separated string.
  //
  // E.g. <fieldName1>, <fieldName2>, etc...
  static fieldNames(fields: AnyJson[]): string {
    return JSON.stringify(fields) === '{}'
      ? ''
      : fields.reduce((acc: string, { name }, index: number) => {
          if (index > 0) {
            acc += ', ';
          }
          return (acc += `${name}`);
        }, '');
  }

  // Format field names with their type info into a human readable, comma separated string.
  //
  // E.g. <fieldName1>: <fieldType1>, <fieldName2>: <fieldType2>, etc...
  static fieldTypes(fields: AnyJson[]): string {
    return JSON.stringify(fields) === '[]'
      ? ''
      : fields.reduce((acc: string, { name, type }, index: number) => {
          if (index > 0) {
            acc += ', ';
          }
          return (acc += `${name}: ${type}`);
        }, '');
  }

  // ------------------------------------------------------
  // Type paths and params.
  // ------------------------------------------------------

  // Format a string representation of the type using its path and params.
  //
  // E.g. BalanceOf<T>, where BalanceOf is the path and <T> is its param.
  static typeToString(path: string[], params: string[]): string {
    const paramsStr = this.paramsToString(params);
    const pathStr = this.pathToString(path);

    let label = `${pathStr}`;
    if (paramsStr) {
      label += `${paramsStr}`;
    }
    return label;
  }

  // Format a type's params into a string.
  //
  // E.g. <param1>, <param2>, etc...
  static paramsToString(params: AnyJson): string {
    return params.reduce(
      (formatted: string, { name }: { name: string }, index: number) => {
        let str = index === 0 ? `<${name}` : `, ${name}`;
        if (index === params.length - 1) {
          str += `>`;
        }
        return (formatted += str);
      },
      ''
    );
  }

  // Format a type's path into a string.
  //
  // E.g. <path>::<path>::<path>
  static pathToString(path: string[]): string {
    return path.reduce((formatted: string, item: string, index: number) => {
      if (index === 0) {
        return item;
      }
      return index === 0 ? item : `${formatted}::${item}`;
    }, '');
  }
}
