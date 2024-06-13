// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
