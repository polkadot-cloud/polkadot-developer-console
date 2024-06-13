// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/types';

// ------------------------------------------------------
// Labels.
// ------------------------------------------------------

// Gets a short label from a label input.
export const getShortLabel = (
  input: string | { long: string; short: string }
) => (typeof input === 'string' ? input : input.short);

// Gets a long label from a label input.
export const getLongLabel = (
  input: string | { long: string; short: string }
) => (typeof input === 'string' ? input : input.long);

// Verify if a variant is an Option.
export const verifyOption = (
  shortLabel: string,
  variant: { name?: string }[]
) =>
  shortLabel === 'Option' &&
  variant?.[0]?.name === 'None' &&
  variant?.[1]?.name === 'Some';

// ------------------------------------------------------
// Type paths and params.
// ------------------------------------------------------

// Format a string representation of the type using its path and params.
//
// E.g. BalanceOf<T>, where BalanceOf is the path and <T> is its param.
export const typeToString = (path: string[], params: string[]): string => {
  const paramsStr = paramsToString(params);
  const pathStr = pathToString(path);

  let label = `${pathStr}`;
  if (paramsStr) {
    label += `${paramsStr}`;
  }
  return label;
};

// Format a type's params into a string.
//
// E.g. <param1>, <param2>, etc...
export const paramsToString = (params: AnyJson): string =>
  params.reduce(
    (formatted: string, { name }: { name: string }, index: number) => {
      let str = index === 0 ? `<${name}` : `, ${name}`;
      if (index === params.length - 1) {
        str += `>`;
      }
      return (formatted += str);
    },
    ''
  );

// Format a type's path into a string.
//
// E.g. <path>::<path>::<path>
export const pathToString = (path: string[]): string =>
  path.reduce((formatted: string, item: string, index: number) => {
    if (index === 0) {
      return item;
    }
    return index === 0 ? item : `${formatted}::${item}`;
  }, '');
