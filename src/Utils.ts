// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Format a submitted input string.
export const formatInputString = (str: string, toLower = false): string => {
  // Remove extra spaces.
  str = !toLower
    ? str.replace(/\s{2,}/g, ' ')
    : str.toLowerCase().replace(/\s{2,}/g, ' ');
  // Trim.
  str = str.trim();

  return str;
};
