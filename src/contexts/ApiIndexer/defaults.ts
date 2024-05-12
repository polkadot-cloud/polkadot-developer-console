// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ApiIndexerContextInterface } from './types';

export const defaultApiIndexerContext: ApiIndexerContextInterface = {
  apiIndexes: {},
  getTabApiIndexes: (tabId) => [],
  getTabApiIndex: (tabId, label) => undefined,
  setTabApiIndex: (tabId, index) => {},
  removeTabApiIndexes: (tabId) => {},
  removeTabApiIndex: (tabId, label) => {},
};
