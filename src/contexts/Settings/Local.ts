// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

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
