// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Api } from 'model/Api';
import type { APIChainSpec, ApiStatus, OwnerId } from 'model/Api/types';

export interface ApiContextInterface {
  getTabApi: () => Api | undefined;
  getApiStatus: (ownerId: OwnerId) => ApiStatus;
  getApiActive: (ownerId: OwnerId) => boolean;
  getChainSpec: (ownerId: OwnerId) => APIChainSpec | null;
}
