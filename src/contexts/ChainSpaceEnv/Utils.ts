// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const eqSet = (xs: Set<any>, ys: Set<any>) =>
  xs.size === ys.size && [...xs].every((x) => ys.has(x));
