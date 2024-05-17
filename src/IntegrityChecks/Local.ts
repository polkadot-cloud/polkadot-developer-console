// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  performTabsCheck,
  sanitizeAppliedTags,
  sanitizeChainStateConsts,
  sanitizeChainStateFilters,
  sanitizeChainStateSections,
  sanitizeChainStateSubs,
  sanitizeChainUi,
  sanitizeKeysForTabExistence,
  sanitizeTags,
} from 'IntegrityChecks';
import * as localTabs from 'contexts/Tabs/Local';
import * as localTags from 'contexts/Tags/Local';
import * as localChainFilter from 'contexts/ChainFilter/Local';
import * as localChainUi from 'contexts/ChainUi/Local';
import * as localChainState from 'contexts/ChainState/Local';
import { defaultTabs } from 'contexts/Tabs/defaults';
import { defaultTags, defaultTagsConfig } from 'contexts/Tags/defaults';
import {
  defaultAppliedTags,
  defaultCustomEndpoints,
} from 'contexts/ChainFilter/defaults';
import type { RemoveOrSetInput } from './types';

// ------------------------------------------------------
// Tabs.
// ------------------------------------------------------

// Check local tabs data.
export const checkLocalTabs = () => {
  // Use default tabs if activeTabs is empty.
  const activeTabs = localTabs.getTabs() || defaultTabs;
  const selectedTabId = localTabs.getSelectedTabId() || 0;
  const activeTabIndex = localTabs.getActiveTabIndex() || 0;

  const { selectedTabsValid, selectedTabIdValid, activeTabIndexValid } =
    performTabsCheck({
      activeTabs,
      selectedTabId,
      activeTabIndex,
    });

  // Clear all tab data if active tabs are invalid.
  if (!selectedTabsValid) {
    removeLocalStorageState();
  }

  // Clear selectedTabId if it is not valid.
  if (!selectedTabIdValid) {
    localStorage.removeItem('selectedTabId');
  }

  // Clear `activeTabIndex` if not valid.
  if (!activeTabIndexValid) {
    localStorage.removeItem('activeTabIndex');
  }
};

// ------------------------------------------------------
// Tags.
// ------------------------------------------------------

export const checkLocalTags = () => {
  const tags = localTags.getTags() || defaultTags;
  const tagsConfig = localTags.getTagsConfig() || defaultTagsConfig;

  const { updated, result } = sanitizeTags({ tags, tagsConfig });

  // If result is empty, clear it from local storage.
  if (JSON.stringify(result) === '{}') {
    localStorage.removeItem('tagsConfig');
  } else {
    // Update local storage if `tagsConfig` was updated.
    if (updated) {
      localTags.setTagsConfig(result);
    }
  }
};

// ------------------------------------------------------
// Chain Filter.
// ------------------------------------------------------

// Check existing local storage and clear up if there are errors.
export const checkLocalChainFilter = () => {
  // Use default tabs if activeTabs is empty.
  const activeTabs = localTabs.getTabs() || defaultTabs;
  const tags = localTags.getTags() || defaultTags;
  const searchTerms = localChainFilter.getSearchTerms() || {};
  const customEndpoints =
    localChainFilter.getCustomEndpoints() || defaultCustomEndpoints;
  const appliedTags = localChainFilter.getAppliedTags() || defaultAppliedTags;

  // Check if tabs exist for each search term, and remove the entry otherwise.
  removeOrSetLocalData(
    'searchTerms',
    sanitizeKeysForTabExistence(activeTabs, searchTerms)
  );

  // Check if tabs exist for each custom endpoint, and remove the entry otherwise.
  removeOrSetLocalData(
    'customEndpoints',
    sanitizeKeysForTabExistence(activeTabs, customEndpoints)
  );

  // Check if tab index exists for each applied tag key, and that the corresponding tag entry also
  // exists. Remove otherwise.
  removeOrSetLocalData(
    'appliedTags',
    sanitizeAppliedTags({
      activeTabs,
      tags,
      appliedTags,
    })
  );
};

// ------------------------------------------------------
// Chain Ui.
// ------------------------------------------------------

// Check existing local storage and clear up if there are errors.
export const checkLocalChainUi = () => {
  // Use default tabs if activeTabs is empty.
  const activeTabs = localTabs.getTabs() || defaultTabs;

  const chainUi = localChainUi.getChainUi() || {};
  const chainStateSections = localChainUi.getChainStateSections() || {};
  const chainStateFilters = localChainUi.getChainStateFilters() || {};

  removeOrSetLocalData('chainUi', sanitizeChainUi({ activeTabs, chainUi }));
  removeOrSetLocalData(
    'chainStateSections',
    sanitizeChainStateSections({ activeTabs, chainStateSections })
  );

  removeOrSetLocalData(
    'chainStateFilters',
    sanitizeChainStateFilters({ activeTabs, chainStateFilters })
  );
};

// ------------------------------------------------------
// Chain State.
// ------------------------------------------------------

// Check existing local storage and clear up if there are errors.
export const checkLocalChainState = () => {
  // Use default tabs if activeTabs is empty.
  const activeTabs = localTabs.getTabs() || defaultTabs;
  const chainStateConsts = localChainState.getChainStateConstants() || {};
  const chainStateSubs = localChainState.getChainStateSubscriptions() || {};

  removeOrSetLocalData(
    'chainStateConsts',
    sanitizeChainStateConsts({ activeTabs, chainStateConsts })
  );

  removeOrSetLocalData(
    'chainStateSubs',
    sanitizeChainStateSubs({ activeTabs, chainStateSubs })
  );
};

// ------------------------------------------------------
// Utils.
// ------------------------------------------------------

// Remove or update local data depending on resulting updated state.
export const removeOrSetLocalData = <T>(
  key: string,
  { updated, result }: RemoveOrSetInput<T>
) => {
  if (!result || JSON.stringify(result) === '{}') {
    localStorage.removeItem(key);
  } else {
    if (updated) {
      localChainFilter.setCustomEndpoints(result);
    }
  }
};

// Call all local integrity checks.
export const performLocalIntegrityChecks = () => {
  checkLocalTabs();
  checkLocalTags();
  checkLocalChainFilter();
};

// Remove all local storage state tied to tabs config, or remove all workspace state entirely if
// `includeTags` is set to true.
export const removeLocalStorageState = (includeTags = false) => {
  localStorage.removeItem('activeTabs');
  localStorage.removeItem('activePages');
  localStorage.removeItem('selectedTabId');
  localStorage.removeItem('activeTabIndex');
  localStorage.removeItem('searchTerms');
  localStorage.removeItem('customEndpoints');
  localStorage.removeItem('appliedTags');
  localStorage.removeItem('chainUi');
  localStorage.removeItem('chainStateSections');
  localStorage.removeItem('chainStateFilters');
  localStorage.removeItem('chainStateConsts');
  localStorage.removeItem('chainStateSubs');
  localStorage.removeItem('pageRedirects');

  if (includeTags) {
    localStorage.removeItem('tags');
    localStorage.removeItem('tagsConfig');
  }
};
