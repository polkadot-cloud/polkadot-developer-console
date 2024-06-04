// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Gets a short label from a label input.
export const getShortLabel = (
  input: string | { long: string; short: string }
) => {
  let output;
  if (typeof input === 'string') {
    output = input;
  } else {
    output = input.short;
  }
  return output;
};

// Gets a long label from a label input.
export const getLongLabel = (
  input: string | { long: string; short: string }
) => {
  let output;
  if (typeof input === 'string') {
    output = input;
  } else {
    output = input.long;
  }
  return output;
};
