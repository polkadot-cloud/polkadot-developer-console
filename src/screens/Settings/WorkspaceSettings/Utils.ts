// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import { performTabsCheck } from 'IntegrityChecks';

// The supported localStorage keys for import and export.
const SUPPORTED_WORKSPACE_LOCAL_STORAGE_KEYS = [
  'activeTabs',
  'activeTabId',
  'activeTabIndex',
  'tags',
  'tagsConfig',
  'customNodeUrls',
  'searchTerms',
  'appliedTags',
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
export const importWorkspace = async (file: File) => {
  const reader = new FileReader();

  reader.readAsText(file);

  reader.onload = () => {
    const text = reader.result;
    if (typeof text === 'string') {
      try {
        const json = JSON.parse(text);

        // Check if imported tabs data is valid.
        const activeTabs = json.activeTabs;
        const activeTabId = json?.activeTabId || 0;
        const activeTabIndex = json?.activeTabIndex || 0;

        const tabsResult = performTabsCheck({
          activeTabs,
          activeTabId,
          activeTabIndex,
        });

        if (!Object.values(tabsResult).every((result) => result === true)) {
          throw 'Invalid Tabs Data';
        }

        // TODO: check remaining supported import data.

        // Persist each item from the import data to localStorage
        // if (isDataValid) {
        //     Object.entries(json).forEach(([key, value]) => {
        //       localStorage.setItem(key, value);
        //     });
        // }
      } catch (e) {
        // Provided workspace file is not a valid JSON object.
      }
    }
  };

  reader.onerror = () => {
    console.log(reader.error);
  };
};
