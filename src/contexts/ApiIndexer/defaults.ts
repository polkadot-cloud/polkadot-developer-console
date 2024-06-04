// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import type { ApiIndexerContextInterface } from './types';

export const defaultApiIndexerContext: ApiIndexerContextInterface = {
  apiIndexes: {},
  getTabApiIndexes: (ownerId) => [],
  getTabApiIndex: (ownerId, label) => undefined,
  setTabApiIndex: (ownerId, index) => {},
  removeTabApiIndexes: (ownerId) => {},
  removeTabApiIndex: (ownerId, index) => {},
};
