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
  const tags = localTags.getTags();
  const tagsConfig = localTags.getTagsConfig();

  // Check that each tag id in `tagsConfig` is present in `tags`, and delete the config otherwise.
  if (tags && tagsConfig) {
    const maybeUpdatedConfig = tagsConfig;
    let updated = false;
    Object.entries(tagsConfig).forEach(([tagId, chains]) => {
      for (const chain of chains) {
        if (!NetworkDirectory[chain]) {
          // If error, fallback to defaults if exist, otherwise filter out the chain.
          maybeUpdatedConfig[tagId] =
            defaultTagsConfig[tagId] || chains.filter((c) => c !== chain);
          updated = true;
        }
      }
    });

    if (JSON.stringify(maybeUpdatedConfig) === '{}') {
      localStorage.removeItem('tagsConfig');
    } else {
      if (updated) {
        localTags.setTagsConfig(maybeUpdatedConfig);
      }
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
  if (searchTerms) {
    const maybeUpdatedSearchTerms = searchTerms;
    let updated = false;
    Object.entries(searchTerms).forEach(([tabId, searchTerm]) => {
      if (
        !activeTabs?.find(({ id }) => id === Number(tabId)) ||
        searchTerm === ''
      ) {
        delete maybeUpdatedSearchTerms[Number(tabId)];
        updated = true;
      }
    });

    if (JSON.stringify(maybeUpdatedSearchTerms) === '{}') {
      localStorage.removeItem('searchTerms');
    } else {
      if (updated) {
        localChainFilter.setSearchTerms(maybeUpdatedSearchTerms);
      }
    }
  }

  // Check if tabs exist for each custom node url, and remove the entry otherwise. Also remove empty
  // strings.
  if (customNodeUrls) {
    const maybeUpdatedCustomNodeUrls = customNodeUrls;
    let updated = false;
    Object.entries(customNodeUrls).forEach(([tabId, url]) => {
      if (!activeTabs?.find(({ id }) => id === Number(tabId)) || url === '') {
        delete maybeUpdatedCustomNodeUrls[Number(tabId)];
        updated = true;
      }
    });

    if (JSON.stringify(maybeUpdatedCustomNodeUrls) === '{}') {
      localStorage.removeItem('customNodeUrls');
    } else {
      if (updated) {
        localChainFilter.setCustomNodeUrls(maybeUpdatedCustomNodeUrls);
      }
    }
  }

  // Check if tab index exists for each applied tag key, and remove otherwise.
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
