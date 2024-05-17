// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import {
  performTabsCheck,
  sanitizeAppliedTags,
  sanitizeChainStateConsts,
  sanitizeChainUi,
  sanitizeKeysForTabExistence,
  sanitizeTags,
} from 'IntegrityChecks';
import { defaultTabs } from 'contexts/Tabs/defaults';
import { defaultTags } from 'contexts/Tags/defaults';

// The supported localStorage keys for import and export.
const SUPPORTED_WORKSPACE_LOCAL_STORAGE_KEYS = [
  'activeTabs',
  'selectedTabId',
  'activeTabIndex',
  'tags',
  'tagsConfig',
  'searchTerms',
  'customEndpoints',
  'appliedTags',
  'chainUi',
  'chainStateConsts',
  'settings',
];

// Exporting workspace settings.
export const exportWorkspace = () => {
  // Fetch all keys from localStorage
  const storageKeys = SUPPORTED_WORKSPACE_LOCAL_STORAGE_KEYS;
  const exportData = storageKeys.reduce(
    (acc: Record<string, AnyJson>, key: string) => {
      try {
        const data = localStorage.getItem(key);
        // Add local storage item if not falsy.
        if (data) {
          acc[key] = JSON.parse(data);
        }
        return acc;
      } catch (e) {
        // Continue accumulating on error.
        return acc;
      }
    },
    {}
  );

  try {
    // Convert to JSON and create a data URI to download the file.
    const dataStr = JSON.stringify(exportData, undefined);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'workspace-settings.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    linkElement.remove();

    return true;
  } catch (e) {
    return false;
  }
};

// Importing workspace settings.
export const importWorkspace = (file: File) => {
  const reader = new FileReader();

  reader.readAsText(file);

  reader.onload = () => {
    const text = reader.result;
    if (typeof text === 'string') {
      try {
        let json = JSON.parse(text);

        // Check if imported tabs data is valid.
        const activeTabs = json?.activeTabs;
        const selectedTabId = json?.activeTabId || 0;
        const activeTabIndex = json?.activeTabIndex || 0;

        const tabsResult = performTabsCheck({
          activeTabs,
          selectedTabId,
          activeTabIndex,
        });

        if (!Object.values(tabsResult).every((result) => result === true)) {
          throw 'Invalid Tabs Data';
        }

        // Check if imported tags are valid.
        // ----------------------------------------------
        const tags = json.tags || defaultTags;
        const tagsConfig = json.tagsConfig || {};
        const { result: tagsConfigResult } = sanitizeTags({ tags, tagsConfig });
        json = deleteKeyOrOverwrite('tagsConfig', tagsConfigResult, json);

        // Check if imported search terms are valid.
        // ----------------------------------------------
        const searchTerms = json.searchTerms || {};
        const { result: searchTermsResult } = sanitizeKeysForTabExistence(
          activeTabs || defaultTabs,
          searchTerms
        );
        json = deleteKeyOrOverwrite('searchTerms', searchTermsResult, json);

        // Check if imported custom endpoints are valid.
        // ----------------------------------------------
        const customEndpoints = json.customEndpoints || {};
        const { result: customEndpointsResult } = sanitizeKeysForTabExistence(
          activeTabs || defaultTabs,
          customEndpoints
        );
        json = deleteKeyOrOverwrite(
          'customEndpoints',
          customEndpointsResult,
          json
        );

        // Check if imported applied tags are valid.
        // ----------------------------------------------
        const appliedTags = json.appliedTags || {};
        const { result: appliedTagsResult } = sanitizeAppliedTags({
          activeTabs: activeTabs || defaultTabs,
          tags: tags || defaultTags,
          appliedTags,
        });
        json = deleteKeyOrOverwrite('appliedTags', appliedTagsResult, json);

        // Check if chain ui is valid.
        // ----------------------------------------------
        const chainUi = json.chainUi || {};
        const { result: chainUiResult } = sanitizeChainUi({
          activeTabs: activeTabs || defaultTabs,
          chainUi,
        });

        json = deleteKeyOrOverwrite('chainUi', chainUiResult, json);

        // Check if chain state constants are valid.
        // ----------------------------------------------
        const chainStateConsts = json.chainStateConsts || {};
        const { result: chainStateConstsResult } = sanitizeChainStateConsts({
          activeTabs: activeTabs || defaultTabs,
          chainStateConsts,
        });
        json = deleteKeyOrOverwrite(
          'chainStateConsts',
          chainStateConstsResult,
          json
        );

        // --------------------------------------------------------
        // Persist each item from the import data to localStorage.
        // --------------------------------------------------------
        Object.entries(json).forEach(([key, value]) => {
          try {
            localStorage.setItem(key, JSON.stringify(value));
          } catch (e) {
            // Failed to persist item to localStorage. Silent error;
          }
        });
      } catch (e) {
        alert('Import failed: Invalid Workspace File');
      }
    }
  };

  reader.onerror = () => {
    alert('Import failed: Invalid Workspace File');
  };
};

const deleteKeyOrOverwrite = <T>(
  key: string,
  value: T,
  current: Record<string, AnyJson>
) => {
  if (value === undefined || JSON.stringify(value) === '{}') {
    delete current[key];
  } else {
    current[key] = value;
  }
  return current;
};
