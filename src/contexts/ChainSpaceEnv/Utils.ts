// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiInstanceId } from 'model/Api/types';

export const getApiInstanceOwnerAndIndex = (instanceId: ApiInstanceId) => {
  const split = instanceId.split('_');
  const last = split.pop();
  const remaining = split.join('_');

  return {
    ownerId: remaining,
    index: Number(last),
  };
};
