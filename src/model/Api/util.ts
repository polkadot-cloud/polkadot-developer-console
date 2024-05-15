// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiInstanceId } from './types';

// Get the instance index from an instance id.
export const getIndexFromInstanceId = (str: ApiInstanceId) => {
  const index = str.lastIndexOf('_');
  const result = str.substring(index + 1);
  return Number(result);
};
