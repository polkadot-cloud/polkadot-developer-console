// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';
import type { LocalSettings, SettingsKey } from './types';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved auto connect setting from local storage, or return undefined otherwise.
export const getSetting = (key: SettingsKey): boolean => {
  const result = localStorageOrDefault(`settings`, undefined, true) as
    | LocalSettings
    | undefined;

  if (result) {
    const maybeValue = result[key];
    if (maybeValue) {
      return maybeValue as boolean;
    }
  }
  return false;
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
