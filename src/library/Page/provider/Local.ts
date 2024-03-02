// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';
import type { PageId } from 'App';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved page section from local storage, or returns undefined otherwise.
export const getActiveSection = (
  pageId: PageId,
  tabId: number
): number | undefined => {
  const result = localStorageOrDefault(
    `pageSection:${tabId}:${pageId}`,
    undefined,
    true
  ) as number | undefined;

  if (result) {
    return result as number;
  }
};

// ------------------------------------------------------
// Setters.
// ------------------------------------------------------

// Sets page section to local storage.
export const setActiveSection = (
  pageId: PageId,
  tabId: number,
  value: number
) => {
  localStorage.setItem(`pageSection:${tabId}:${pageId}`, JSON.stringify(value));
};
