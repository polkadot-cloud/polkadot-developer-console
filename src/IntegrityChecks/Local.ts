// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  performTabsCheck,
  sanitizeAppliedTags,
  sanitizeKeysForTabExistence,
  sanitizeTags,
} from 'IntegrityChecks';
import * as localTabs from 'contexts/Tabs/Local';
import * as localTags from 'contexts/Tags/Local';
import * as localChainFilter from 'contexts/ChainFilter/Local';
import { defaultTabs } from 'contexts/Tabs/defaults';
import { defaultTags, defaultTagsConfig } from 'contexts/Tags/defaults';
import {
  defaultAppliedTags,
  defaultCustomNodeUrls,
  defaultSearchTerms,
} from 'contexts/ChainFilter/defaults';
import type { RemoveOrSetInput } from './types';

// ------------------------------------------------------
// Tabs.
// ------------------------------------------------------

// Check local tabs data.
export const checkLocalTabs = () => {
  // Use default tabs if activeTabs is empty.
  const activeTabs = localTabs.getTabs() || defaultTabs;
  const activeTabId = localTabs.getActiveTabId() || 0;
  const activeTabIndex = localTabs.getActiveTabIndex() || 0;

  const { activeTabsValid, activeTabIdValid, activeTabIndexValid } =
    performTabsCheck({
      activeTabs,
      activeTabId,
      activeTabIndex,
    });

  // Clear all tab data if active tabs are invalid.
  if (!activeTabsValid) {
    removeLocalStorageState();
  }

  // Clear activeTabId if it is not valid.
  if (!activeTabIdValid) {
    localStorage.removeItem('activeTabId');
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
  const searchTerms = localChainFilter.getSearchTerms() || defaultSearchTerms;
  const customNodeUrls =
    localChainFilter.getCustomNodeUrls() || defaultCustomNodeUrls;
  const appliedTags = localChainFilter.getAppliedTags() || defaultAppliedTags;

  // Check if tabs exist for each search term, and remove the entry otherwise.
  removeOrSetLocalData(
    'searchTerms',
    sanitizeKeysForTabExistence(activeTabs, searchTerms)
  );

  // Check if tabs exist for each custom node url, and remove the entry otherwise.
  removeOrSetLocalData(
    'customNodeUrls',
    sanitizeKeysForTabExistence(activeTabs, customNodeUrls)
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
// Utils.
// ------------------------------------------------------

// Tidy up local storage on invalid active tabs. Requires any local storage dependent on tabs config
// to be removed.
export const removeLocalStorageState = () => {
  localStorage.removeItem('activeTabs');
  localStorage.removeItem('activeTabId');
  localStorage.removeItem('activeTabIndex');
  localStorage.removeItem('searchTerms');
  localStorage.removeItem('customNodeUrls');
  localStorage.removeItem('appliedTags');
  localStorage.removeItem('pageSections');
  localStorage.removeItem('pageRedirects');
};

// Call all local integrity checks.
export const performLocalIntegrityChecks = () => {
  checkLocalTabs();
  checkLocalTags();
  checkLocalChainFilter();
};

// Remove or update local data depending on resulting updated state.
export const removeOrSetLocalData = <T>(
  key: string,
  { updated, result }: RemoveOrSetInput<T>
) => {
  if (!result || JSON.stringify(result) === '{}') {
    localStorage.removeItem(key);
  } else {
    if (updated) {
      localChainFilter.setCustomNodeUrls(result);
    }
  }
};
