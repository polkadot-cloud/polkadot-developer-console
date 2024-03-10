// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Tabs } from 'contexts/Tabs/types';
import { NetworkDirectory } from 'config/networks';
import { defaultTagsConfig } from 'contexts/Tags/defaults';

import type { TagsConfig, TagsList } from 'contexts/Tags/types';
import type { AppliedTags } from 'contexts/ChainFilter/types';

// ------------------------------------------------------
// Tabs.
// ------------------------------------------------------

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
    activeTabId === 0
      ? true
      : activeTabsValid &&
        activeTabId &&
        activeTabs.find(({ id }) => id === activeTabId) !== undefined;

  // Check if `activeTabIndex` is a valid tab index.
  const activeTabIndexValid =
    activeTabIndex === 0
      ? true
      : activeTabsValid &&
        activeTabIndex &&
        activeTabs[activeTabIndex] !== undefined;

  return {
    activeTabsValid,
    activeTabIdValid,
    activeTabIndexValid,
  };
};

// Checks if a tabId exists for each key of the provided string data.
export const sanitizeKeysForTabExistence = (
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

// ------------------------------------------------------
// Tags.
// ------------------------------------------------------

// Sanitize provided tags and tagsConfig data and return the sanitized data.
export const sanitizeTags = ({
  tags,
  tagsConfig,
}: {
  tags: TagsList;
  tagsConfig: TagsConfig;
}) => {
  let updated = false;
  const result = tagsConfig;

  // Check that each tag id in `tagsConfig` is present in `tags`, and delete the config otherwise.
  if (tags && tagsConfig) {
    Object.entries(tagsConfig).forEach(([tagId, chains]) => {
      for (const chain of chains) {
        if (!NetworkDirectory[chain]) {
          // If error, fallback to defaults if exist, otherwise filter out the chain.
          result[tagId] =
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
    result,
  };
};

// ------------------------------------------------------
// Chain Filter.
// ------------------------------------------------------

// Sanitize applied tags data and return the sanitized data.
export const sanitizeAppliedTags = ({
  activeTabs,
  tags,
  appliedTags,
}: {
  activeTabs: Tabs;
  tags: TagsList;
  appliedTags: AppliedTags;
}) => {
  const result = appliedTags;
  let updated = false;

  if (result) {
    Object.entries(appliedTags).forEach(([tabId, applied]) => {
      if (!activeTabs?.find(({ id }) => id === Number(tabId))) {
        delete result[Number(tabId)];
        updated = true;
      } else {
        // Check if each `applied` value is a valid tag id, and remove otherwise.
        applied.forEach((tagId) => {
          if (!tags?.[tagId]) {
            result[Number(tabId)].splice(applied.indexOf(tagId), 1);
            updated = true;
          }
        });
      }
    });
  }

  return {
    updated,
    result,
  };
};
