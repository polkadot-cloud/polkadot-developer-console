// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
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

// Detect if an event is a CustomEvent by checking if it has a `detail` property.
export const isCustomEvent = (event: Event): event is CustomEvent =>
  'detail' in event;
