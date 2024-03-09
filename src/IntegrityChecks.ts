// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import * as localTabs from 'contexts/Tabs/Local';
import * as localTags from 'contexts/Tags/Local';
import * as localChainFilter from 'contexts/ChainFilter/Local';
import { defaultTabs } from 'contexts/Tabs/defaults';
import type { Tabs } from 'contexts/Tabs/types';
import { NetworkDirectory } from 'config/networks';
import { defaultTags, defaultTagsConfig } from 'contexts/Tags/defaults';
import {
  defaultAppliedTags,
  defaultCustomNodeUrls,
  defaultSearchTerms,
} from 'contexts/ChainFilter/defaults';
import type { TagsConfig, TagsList } from 'contexts/Tags/types';

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
    removeOnInvalidTabs();
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

// Perform integrity check on active tabs data.
export const performTabsCheck = ({
  activeTabs,
  activeTabId,
  activeTabIndex,
}: {
  activeTabs: Tabs;
  activeTabId: number;
  activeTabIndex: number;
}) => {
  // Check if each tab has its required properties.
  let activeTabsValid: boolean;
  try {
    activeTabs.forEach((tab) => {
      if (
        !(
          'id' in tab &&
          'connectFrom' in tab &&
          'name' in tab &&
          'autoConnect' in tab
        )
      ) {
        throw new Error('Invalid tab');
      }
    });
    activeTabsValid = true;
  } catch (e) {
    activeTabsValid = false;
  }

  // Check if `activeTabId` is among `activeTabs`.
  const activeTabIdValid =
    activeTabsValid &&
    activeTabId &&
    activeTabs.find(({ id }) => id === activeTabId);

  // Check if `activeTabIndex` is a valid tab index.
  const activeTabIndexValid =
    activeTabsValid && activeTabIndex && !!activeTabs[activeTabIndex];

  return {
    activeTabsValid,
    activeTabIdValid,
    activeTabIndexValid,
  };
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

// Sanitize provided tags and tagsConfig data and return the sanitized data.
export const sanitizeTags = ({
  tags,
  tagsConfig,
}: {
  tags: TagsList;
  tagsConfig: TagsConfig;
}) => {
  let updated = false;
  const tagsConfigResult = tagsConfig;

  // Check that each tag id in `tagsConfig` is present in `tags`, and delete the config otherwise.
  if (tags && tagsConfig) {
    Object.entries(tagsConfig).forEach(([tagId, chains]) => {
      for (const chain of chains) {
        if (!NetworkDirectory[chain]) {
          // If error, fallback to defaults if exist, otherwise filter out the chain.
          tagsConfigResult[tagId] =
            defaultTagsConfig[tagId] || chains.filter((c) => c !== chain);
          updated = true;
        }
      }
    });
  }

  // NOTE: Tags are not currently being checked for integrity. Could be checked for data structure,
  // as with other data too.
  return {
    updated,
    tagsConfigResult,
  };
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
    sanitizeTabExistence(activeTabs, searchTerms);

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
    sanitizeTabExistence(activeTabs, customNodeUrls);

  if (!customNodesResult || JSON.stringify(customNodesResult) === '{}') {
    localStorage.removeItem('customNodeUrls');
  } else {
    if (customNodesUpdated) {
      localChainFilter.setCustomNodeUrls(customNodesResult);
    }
  }

  // Check if tab index exists for each applied tag key, and that the corresponding tag entry also
  // exists. Remove otherwise.
  if (appliedTags) {
    const maybeUpdatedAppliedTags = appliedTags;
    let updated = false;
    Object.entries(appliedTags).forEach(([tabId, applied]) => {
      if (!activeTabs?.find(({ id }) => id === Number(tabId))) {
        delete maybeUpdatedAppliedTags[Number(tabId)];
        updated = true;
      } else {
        // Check if each `applied` value is a valid tag id, and remove otherwise.
        applied.forEach((tagId) => {
          if (!tags?.[tagId]) {
            maybeUpdatedAppliedTags[Number(tabId)].splice(
              applied.indexOf(tagId),
              1
            );
            updated = true;
          }
        });
      }
    });

    if (JSON.stringify(maybeUpdatedAppliedTags) === '{}') {
      localStorage.removeItem('appliedTags');
    } else {
      if (updated) {
        localChainFilter.setAppliedTags(maybeUpdatedAppliedTags);
      }
    }
  }
};

// ------------------------------------------------------
// Utils.
// ------------------------------------------------------

// Tidy up local storage on invalid active tabs. Requires any local storage dependent on tabs config
// to be removed.
const removeOnInvalidTabs = () => {
  localStorage.removeItem('activeTabs');
  localStorage.removeItem('activeTabId');
  localStorage.removeItem('activeTabIndex');
  localStorage.removeItem('searchTerms');
  localStorage.removeItem('appliedTags');
};

// Call all integrity checks.
export const performIntegrityChecks = () => {
  checkLocalTabs();
  checkLocalTags();
  checkLocalChainFilter();
};

// Checks if a tabId exists for each key of the provided string data.
const sanitizeTabExistence = (
  activeTabs: Tabs,
  entries?: Record<number, string>
) => {
  const result = entries;
  let updated = false;

  if (result) {
    Object.entries(result).forEach(([tabId, entry]) => {
      if (!activeTabs?.find(({ id }) => id === Number(tabId)) || entry === '') {
        delete result[Number(tabId)];
        updated = true;
      }
    });
  }

  return {
    updated,
    result,
  };
};
