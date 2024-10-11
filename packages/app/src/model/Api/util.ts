// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ApiInstanceId } from './types';

// Get the instance index from an instance id.
export const getIndexFromInstanceId = (str: ApiInstanceId) => {
  const index = str.lastIndexOf('_');
  const result = str.substring(index + 1);
  return Number(result);
};
