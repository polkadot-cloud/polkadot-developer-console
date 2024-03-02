// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved auto connect setting from local storage, or return undefined otherwise.
export const getAutoConnect = (): boolean => {
  const result = localStorageOrDefault(
    'settings:autoConnect',
    undefined,
    true
  ) as boolean | undefined;

  if (result !== undefined) {
    return result as boolean;
  }
  return true;
};

// Gets saved auto tab naming setting from local storage, or return undefined otherwise.
export const getAutoTabNaming = (): boolean => {
  const result = localStorageOrDefault(
    'settings:autoTabNaming',
    undefined,
    true
  ) as boolean | undefined;

  if (result !== undefined) {
    return result as boolean;
  }
  return true;
};

// ------------------------------------------------------
// Setters.
// ------------------------------------------------------

// Sets auto connect state to local storage.
export const setAutoConnect = (value: boolean) => {
  localStorage.setItem('settings:autoConnect', JSON.stringify(value));
};

// Sets tab naming state to local storage.
export const setAutoTabNaming = (value: boolean) => {
  localStorage.setItem('settings:autoTabNaming', JSON.stringify(value));
};
