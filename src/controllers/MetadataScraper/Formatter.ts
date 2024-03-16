// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// A static class for formatting values into string representation.

export class Formatter {
  // Format field names into a human readable comma separated string.
  //
  // E.g. <fieldName1>, <fieldName2>, etc...
  static formatFieldNames(fields: Record<string, string>): string {
    return JSON.stringify(fields) === '{}'
      ? ''
      : Object.entries(fields).reduce((acc: string, [name], index: number) => {
          if (index > 0) {
            acc += ', ';
          }
          return (acc += `${name}`);
        }, '');
  }

  // Format field names with their type info into a human readable, comma separated string.
  //
  // E.g. <fieldName1>: <fieldType1>, <fieldName2>: <fieldType2>, etc...
  static formatFieldTypes(fields: Record<string, string>): string {
    return JSON.stringify(fields) === '{}'
      ? ''
      : Object.entries(fields).reduce(
          (acc: string, [name, type], index: number) => {
            if (index > 0) {
              acc += ', ';
            }
            return (acc += `${name}: ${type}`);
          },
          ''
        );
  }
}
