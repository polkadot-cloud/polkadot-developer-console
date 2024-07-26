// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { localStorageOrDefault } from '@w3ux/utils';
import type { LocalSettings, SettingsKey } from './types';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved setting from local storage, or return undefined otherwise.
export const getSetting = (
  key: SettingsKey,
  defaultValue?: boolean
): boolean => {
  const result = localStorageOrDefault(`settings`, undefined, true) as
    | LocalSettings
    | undefined;

  if (result) {
    const maybeValue = result[key];
    if (maybeValue !== undefined) {
      return maybeValue as boolean;
    }
  }

  return defaultValue !== undefined ? defaultValue : false;
};

// Gets the active page from local storage, or returns 0 otherwise.
export const getActivePage = (): number => {
  const result = localStorageOrDefault(`activePage`, undefined, true) as
    | number
    | undefined;

  if (result) {
    return result as number;
  }
  return 0;
};

// ------------------------------------------------------
// Setters.
// ------------------------------------------------------

// Sets a setting value to local storage by the given key.
export const setSetting = (key: SettingsKey, value: boolean) => {
  const current =
    (localStorageOrDefault(`settings`, undefined, true) as
      | LocalSettings
      | undefined) || {};

  const updated = {
    ...current,
    [key]: value,
  };
  localStorage.setItem(`settings`, JSON.stringify(updated));
};

// Sets the active page to local storage.
export const setActivePage = (value: number) => {
  localStorage.setItem(`activePage`, JSON.stringify(value));
};
