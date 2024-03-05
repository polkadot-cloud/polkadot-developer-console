// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Api } from 'model/Api';

export interface ApiContextInterface {
  isReady: boolean;
  getTabApi: () => Api | undefined;
}
