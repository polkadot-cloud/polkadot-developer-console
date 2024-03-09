// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';

// The supported localStorage keys for import and export.
const SUPPORTED_WORKSPACE_LOCAL_STORAGE_KEYS = [
  'activeTabs',
  'activeTabId',
  'activeTabIndex',
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
// TODO: Implement once integrity checks are abstracted into data source specific checks.
// export const importWorkspace = async (file) => {
//   const reader = new FileReader();

//   reader.onload = async (e) => {
//     const text = e.target.result;
//     const importData = JSON.parse(text);

//     // Assuming `performLocalIntegrityChecks` is a function from `IntegrityChecks.ts` that returns a boolean
//     const isDataValid = performLocalIntegrityChecks(importData);

//     if (isDataValid) {
//       Object.entries(importData).forEach(([key, value]) => {
//         localStorage.setItem(key, value); // Persist each item from the import data to localStorage
//       });
//       alert('Workspace settings imported successfully.');
//     } else {
//       alert(
//         'Failed to import workspace settings due to integrity check failure.'
//       );
//     }
//   };

//   reader.readAsText(file);
// };
