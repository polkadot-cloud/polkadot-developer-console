// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { localStorageOrDefault } from '@w3ux/utils';
import type { Tabs } from './types';

// ------------------------------------------------------
// Getters.
// ------------------------------------------------------

// Gets saved active tabs from local storage, or returns undefined otherwise.
export const getTabs = (): Tabs | undefined => {
  const localTabs = localStorageOrDefault('activeTabs', undefined, true) as
    | Tabs
    | undefined;

  if (localTabs) {
    return localTabs as Tabs;
  }
};

// Gets the active tab id from local storage, or returns undefined otherwise.
export const getActiveTabId = (): number | undefined => {
  const activeTabId = localStorageOrDefault('activeTabId', undefined, true) as
    | number
    | undefined;

  if (activeTabId) {
    return activeTabId as number;
  }
};

// Gets the active tab index from local storage, or returns undefined otherwise.
export const getActiveTabIndex = (): number | undefined => {
  const activeTabIndex = localStorageOrDefault(
    'activeTabIndex',
    undefined,
    true
  ) as number | undefined;

  if (activeTabIndex) {
    return activeTabIndex as number;
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
  localStorage.setItem('activeTabId', id.toString());
};

// Sets the active tab index to local storage.
export const setActiveTabIndex = (index: number) => {
  localStorage.setItem('activeTabIndex', index.toString());
};
