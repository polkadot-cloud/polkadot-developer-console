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
  const result = localStorageOrDefault(`pageSections`, undefined, true) as
    | Record<string, number>
    | undefined;

  if (result) {
    const maybePageSection = result[`${tabId}:${pageId}`];
    if (maybePageSection) {
      return maybePageSection as number;
    }
  }
};

// Gets a temporary redirect from local storage, or returns undefined otherwise. If a redirect is
// found it is immediately removed from local storage.
export const getSectionRedirect = (
  pageId: PageId,
  tabId: number
): number | undefined => {
  const result = localStorageOrDefault(`pageRedirects`, undefined, true) as
    | Record<string, number>
    | undefined;

  if (result) {
    const maybePageRedirect = result[`${tabId}:${pageId}`];
    // If page redirect exists, remove it before returning.
    if (maybePageRedirect) {
      const updated = { ...result };
      delete updated[`${tabId}:${pageId}`];

      if (Object.keys(updated).length === 0) {
        localStorage.removeItem(`pageRedirects`);
      } else {
        localStorage.setItem(`pageRedirects`, JSON.stringify(updated));
      }

      return maybePageRedirect as number;
    }
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
  const current =
    (localStorageOrDefault(`pageSections`, undefined, true) as
      | Record<string, number>
      | undefined) || {};

  const updated = {
    ...current,
    [`${tabId}:${pageId}`]: value,
  };
  localStorage.setItem(`pageSections`, JSON.stringify(updated));
};

// Sets a temporary redirect to local storage.
export const setSectionRedirect = (
  pageId: PageId,
  tabId: number,
  value: number
) => {
  const current =
    (localStorageOrDefault(`pageRedirects`, undefined, true) as
      | Record<string, number>
      | undefined) || {};

  const updated = {
    ...current,
    [`${tabId}:${pageId}`]: value,
  };
  localStorage.setItem(`pageRedirects`, JSON.stringify(updated));
};
