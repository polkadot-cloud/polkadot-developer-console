// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { Tabs } from 'contexts/Tabs/types';
import { NetworkDirectory } from 'config/networks';
import { defaultTagsConfig } from 'contexts/Tags/defaults';
import type { TagsConfig, TagsList } from 'contexts/Tags/types';
import type { AppliedTags } from 'contexts/ChainFilter/types';
import type {
  ChainStateFilters,
  ChainStateSection,
  ChainStateSections,
  ChainUiNamespace,
  ChainUiState,
  StorageItemFilter,
} from 'contexts/ChainUi/types';
import type {
  ChainStateConstantsLocal,
  ChainStateConstantsLocalEntries,
  ChainStateSubscriptionLocalEntries,
  ChainStateSubscriptionsLocal,
} from 'contexts/ChainState/types';
import { ownerIdToTabId } from 'contexts/Tabs/Utils';

// ------------------------------------------------------
// Tabs.
// ------------------------------------------------------

// Perform integrity check on active tabs data.
export const performTabsCheck = ({
  activeTabs,
  selectedTabId,
  activeTabIndex,
}: {
  activeTabs: Tabs;
  selectedTabId: number;
  activeTabIndex: number;
}) => {
  // Check if each tab has its required properties.
  let selectedTabsValid: boolean;
  try {
    activeTabs.forEach((tab) => {
      if (
        !('id' in tab && 'name' in tab && 'activeTask' in tab && 'ui' in tab)
      ) {
        throw new Error('Invalid tab');
      }

      const { activeTask, taskData } = tab;
      if (activeTask === 'chainExplorer') {
        {
          if (
            !(
              taskData &&
              'connectFrom' in taskData &&
              'autoConnect' in taskData &&
              'chain' in taskData
            )
          ) {
            throw new Error('Invalid tab');
          }

          const { chain } = taskData;
          if (
            !(
              chain &&
              'id' in chain &&
              'endpoint' in chain &&
              'ss58' in chain &&
              'units' in chain &&
              'unit' in chain &&
              'api' in chain
            )
          ) {
            throw new Error('Invalid tab');
          }
        }
      }
    });
    selectedTabsValid = true;
  } catch (e) {
    selectedTabsValid = false;
  }

  // Check if `selectedTabId` is among `activeTabs`.
  const selectedTabIdValid =
    selectedTabId === 0
      ? true
      : selectedTabsValid &&
        selectedTabId &&
        activeTabs.find(({ id }) => id === selectedTabId) !== undefined;

  // Check if `activeTabIndex` is a valid tab index.
  const activeTabIndexValid =
    activeTabIndex === 0
      ? true
      : selectedTabsValid &&
        activeTabIndex &&
        activeTabs[activeTabIndex] !== undefined;

  return {
    selectedTabsValid,
    selectedTabIdValid,
    activeTabIndexValid,
  };
};

// Checks if a tabId exists for each key of the provided string data.
export const sanitizeKeysForTabExistence = (
  activeTabs: Tabs,
  entries?: Record<string, string>
) => {
  const updated = false;

  const result = Object.fromEntries(
    Object.entries(entries || {}).reduce(
      (acc: [string, string][], [tabId, entry]) => {
        if (activeTabs.find(({ id }) => id === Number(tabId)) && entry !== '') {
          return acc.concat([[tabId, entry]]);
        }
        return acc;
      },
      []
    )
  );

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
          result.tagId =
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
  const updated = false;

  const result = Object.fromEntries(
    Object.entries(appliedTags || {}).reduce(
      (acc: [string, string[]][], [tabId, applied]) => {
        if (!activeTabs?.find(({ id }) => id === Number(tabId))) {
          return acc;
        }
        // Check if each `applied` value is a valid tag id, and remove otherwise.
        applied = applied.reduce((acc2: string[], tagId) => {
          if (!tags?.[tagId]) {
            return acc2;
          }
          return acc2.concat(tagId);
        }, []);

        return acc.concat([[tabId, applied]]);
      },
      []
    )
  );

  return {
    updated,
    result,
  };
};

// ------------------------------------------------------
// Chain Ui.
// ------------------------------------------------------

// Sanitize chain ui data and return the sanitized data.
export const sanitizeChainUi = ({
  activeTabs,
  chainUi,
}: {
  activeTabs: Tabs;
  chainUi: ChainUiState;
}) => {
  const updated = false;

  const result = Object.fromEntries(
    Object.entries(chainUi || {}).reduce(
      (acc: [string, ChainUiNamespace][], [tabId, ui]) => {
        // If provided tab does not exist, remove the entry.
        if (!activeTabs?.find(({ id }) => id === Number(tabId))) {
          return acc;
        }

        // Check the required properties exist in entry.
        if (
          !(
            'calls' in ui &&
            'constants' in ui &&
            'raw' in ui &&
            'storage' in ui
          )
        ) {
          return acc;
        }

        // For each namespace, check if the required properties exist.
        const namespaceKeys = ['calls', 'constants', 'raw', 'storage'];
        for (const namespaceKey of namespaceKeys) {
          const namespace = ui[namespaceKey as keyof ChainUiNamespace];
          if (
            !(
              'pallet' in namespace &&
              'palletSearch' in namespace &&
              'palletSelectOnSearch' in namespace &&
              'search' in namespace &&
              'selectOnSearch' in namespace &&
              'selected' in namespace
            )
          ) {
            return acc;
          }
        }

        return acc.concat([[tabId, ui]]);
      },
      []
    )
  );

  return {
    updated,
    result,
  };
};

// Sanitize chain state sections data and return the sanitized data.
export const sanitizeChainStateSections = ({
  activeTabs,
  chainStateSections,
}: {
  activeTabs: Tabs;
  chainStateSections: ChainStateSections;
}) => {
  const updated = false;

  const result = Object.fromEntries(
    Object.entries(chainStateSections || {}).reduce(
      (acc: [string, ChainStateSection][], [tabId, value]) => {
        if (!activeTabs?.find(({ id }) => id === Number(tabId))) {
          return acc;
        }
        return acc.concat([[tabId, value]]);
      },
      []
    )
  );

  return {
    updated,
    result,
  };
};

// Sanitize chain state filters data and return the sanitized data.
export const sanitizeChainStateFilters = ({
  activeTabs,
  chainStateFilters,
}: {
  activeTabs: Tabs;
  chainStateFilters: ChainStateFilters;
}) => {
  const updated = false;

  const result = Object.fromEntries(
    Object.entries(chainStateFilters || {}).reduce(
      (acc: [string, StorageItemFilter][], [tabId, value]) => {
        if (!activeTabs?.find(({ id }) => id === Number(tabId))) {
          return acc;
        }
        return acc.concat([[tabId, value]]);
      },
      []
    )
  );

  return {
    updated,
    result,
  };
};

// ------------------------------------------------------
// Chain State.
// ------------------------------------------------------

// Sanitize chain state constants data and return the sanitized data.
export const sanitizeChainStateConsts = ({
  activeTabs,
  chainStateConsts,
}: {
  activeTabs: Tabs;
  chainStateConsts: ChainStateConstantsLocal;
}) => {
  const updated = false;

  const result = Object.fromEntries(
    Object.entries(chainStateConsts || {}).reduce(
      (
        acc: [string, ChainStateConstantsLocalEntries][],
        [ownerId, entries]
      ) => {
        const tabId = ownerIdToTabId(ownerId);
        // If provided tab does not exist, remove the entry.
        if (!activeTabs?.find(({ id }) => id === tabId)) {
          return acc;
        }

        // For each entry, check that the required properties exist.
        const values = Object.values(entries);
        for (const entry of values) {
          if (!('pinned' in entry)) {
            return acc;
          }
        }

        return acc.concat([[ownerId, entries]]);
      },
      []
    )
  );

  return {
    updated,
    result,
  };
};

// Sanitize chain state subscriptions data and return the sanitized data.
export const sanitizeChainStateSubs = ({
  activeTabs,
  chainStateSubs,
}: {
  activeTabs: Tabs;
  chainStateSubs: ChainStateSubscriptionsLocal;
}) => {
  const updated = false;

  const result = Object.fromEntries(
    Object.entries(chainStateSubs || {}).reduce(
      (
        acc: [string, ChainStateSubscriptionLocalEntries][],
        [ownerId, entries]
      ) => {
        const tabId = ownerIdToTabId(ownerId);
        // If provided tab does not exist, remove the entry.
        if (!activeTabs?.find(({ id }) => id === tabId)) {
          return acc;
        }

        // For each entry, check that the required properties exist.
        const values = Object.values(entries);
        for (const entry of values) {
          if (
            !(
              'args' in entry &&
              'method' in entry &&
              'namespace' in entry &&
              'pinned' in entry &&
              'type' in entry
            )
          ) {
            return acc;
          }
        }
        return acc.concat([[ownerId, entries]]);
      },
      []
    )
  );

  return {
    updated,
    result,
  };
};
