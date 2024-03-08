// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkDirectory } from 'config/networks';
import * as localTabs from 'contexts/Tabs/Local';
import * as localTags from 'contexts/Tags/Local';
import * as localChainFilter from 'contexts/ChainFilter/Local';
import { defaultTagsConfig } from 'contexts/Tags/defaults';
import { defaultTabs } from 'contexts/Tabs/defaults';

// ------------------------------------------------------
// Tabs.
// ------------------------------------------------------

export const checkLocalTabs = () => {
  // Use default tabs if activeTabs is empty.
  const activeTabs = localTabs.getTabs() || defaultTabs;
  const activeTabId = localTabs.getActiveTabId();
  const activeTabIndex = localTabs.getActiveTabIndex();

  // Check if activeTabs are valid, and clear activeTabs otherwise.
  let activeTabsValid = true;
  try {
    // Check if each tab has its required properties.
    activeTabs.forEach((tab) => {
      if (
        !(
          'id' in tab &&
          'connectFrom' in tab &&
          'chain' in tab &&
          'name' in tab &&
          'autoConnect' in tab
        )
      ) {
        throw new Error('Invalid tab');
      }
    });
  } catch (e) {
    localStorage.removeItem('activeTabs');
    activeTabsValid = false;
  }

  // Check if `activeTabId` is among `activeTabs`, and clear `activeTabId` otherwise.
  if (
    activeTabsValid &&
    activeTabId &&
    !activeTabs.find(({ id }) => id === activeTabId)
  ) {
    localStorage.removeItem('activeTabId');
  }

  // Check if `activeTabIndex` is a valid tab index, and clear `activeTabIndex` otherwise.
  if (activeTabsValid && activeTabIndex && !activeTabs[activeTabIndex]) {
    localStorage.removeItem('activeTabIndex');
  }
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
  const tags = localTags.getTags();
  const searchTerms = localChainFilter.getSearchTerms();
  const appliedTags = localChainFilter.getAppliedTags();

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
