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
    removeOnInvalidLocalTabs();
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

  const { updated, tagsConfigResult } = sanitizeTags({ tags, tagsConfig });

  // If `tagsConfig` is empty, clear it from local storage.
  if (JSON.stringify(tagsConfigResult) === '{}') {
    localStorage.removeItem('tagsConfig');
  } else {
    // Update local storage if `tagsConfig` was updated.
    if (updated) {
      localTags.setTagsConfig(tagsConfigResult);
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

  // Check if tabs exist for each search term, and remove the entry otherwise. Also remove empty
  // strings.
  const { updated: searchTermsUpdated, result: searchTermsResult } =
    sanitizeKeysForTabExistence(activeTabs, searchTerms);

  if (!searchTermsResult || JSON.stringify(searchTermsResult) === '{}') {
    localStorage.removeItem('searchTerms');
  } else {
    if (searchTermsUpdated) {
      localChainFilter.setSearchTerms(searchTermsResult);
    }
  }

  // Check if tabs exist for each custom node url, and remove the entry otherwise. Also remove empty
  // strings.
  const { updated: customNodesUpdated, result: customNodesResult } =
    sanitizeKeysForTabExistence(activeTabs, customNodeUrls);

  if (!customNodesResult || JSON.stringify(customNodesResult) === '{}') {
    localStorage.removeItem('customNodeUrls');
  } else {
    if (customNodesUpdated) {
      localChainFilter.setCustomNodeUrls(customNodesResult);
    }
  }

  // Check if tab index exists for each applied tag key, and that the corresponding tag entry also
  // exists. Remove otherwise.
  const { updated: appliedTagsUpdated, newAppliedTags } = sanitizeAppliedTags({
    activeTabs,
    tags,
    appliedTags,
  });

  if (!newAppliedTags || JSON.stringify(newAppliedTags) === '{}') {
    localStorage.removeItem('appliedTags');
  } else {
    if (appliedTagsUpdated) {
      localChainFilter.setAppliedTags(newAppliedTags);
    }
  }
};

// ------------------------------------------------------
// Utils.
// ------------------------------------------------------

// Tidy up local storage on invalid active tabs. Requires any local storage dependent on tabs config
// to be removed.
export const removeOnInvalidLocalTabs = () => {
  localStorage.removeItem('activeTabs');
  localStorage.removeItem('activeTabId');
  localStorage.removeItem('activeTabIndex');
  localStorage.removeItem('searchTerms');
  localStorage.removeItem('appliedTags');
};

// Call all local integrity checks.
export const performLocalIntegrityChecks = () => {
  checkLocalTabs();
  checkLocalTags();
  checkLocalChainFilter();
};
