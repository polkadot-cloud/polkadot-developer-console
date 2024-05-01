// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { APIChainSpec, ApiInstanceId, ApiStatus } from 'model/Api/types';

export interface ApiContextInterface {
  getApiStatus: (instanceId: ApiInstanceId) => ApiStatus;
  getApiActive: (instanceId: ApiInstanceId) => boolean;
  getChainSpec: (instanceId: ApiInstanceId) => APIChainSpec | null;
}
