// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Api } from 'model/Api';
import type { APIChainSpec, ApiStatus } from 'model/Api/types';

export interface ApiContextInterface {
  getTabApi: () => Api | undefined;
  getApiStatus: (tabId: number) => ApiStatus;
  getApiActive: (tabId: number) => boolean;
  getChainSpec: (tabId: number) => APIChainSpec | null;
}
