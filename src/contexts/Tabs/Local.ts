// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';
import type { Tabs } from './types';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved active tabs from local storage, or returns undefined otherwise.
export const getTabs = (): Tabs | undefined => {
  const result = localStorageOrDefault('activeTabs', undefined, true) as
    | Tabs
    | undefined;

  if (result) {
    return result as Tabs;
  }
};

// Gets the active tab id from local storage, or returns undefined otherwise.
export const getSelectedTabId = (): number | undefined => {
  const result = localStorageOrDefault('selectedTabId', undefined, true) as
    | number
    | undefined;

  if (result !== undefined) {
    return result as number;
  }
};

// Gets the active tab index from local storage, or returns undefined otherwise.
export const getActiveTabIndex = (): number | undefined => {
  const result = localStorageOrDefault('activeTabIndex', undefined, true) as
    | number
    | undefined;

  if (result !== undefined) {
    return result as number;
  }
};

// ------------------------------------------------------
// Setters.
// ------------------------------------------------------

// Sets tabs state to local storage.
export const setTabs = (tabs: Tabs) => {
  localStorage.setItem('activeTabs', JSON.stringify(tabs));
};

// Sets the active tab id to local storage.
export const setActiveTabId = (id: number) => {
  localStorage.setItem('selectedTabId', id.toString());
};

// Sets the active tab index to local storage.
export const setSelectedTabIndex = (index: number) => {
  localStorage.setItem('activeTabIndex', index.toString());
};
