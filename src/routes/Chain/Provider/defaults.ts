// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { IntegrityCheckedChainContext } from './types';

export const defaultChainContextInterface: IntegrityCheckedChainContext = {
  chain: {
    id: 'polkadot',
    endpoint: 'wss://rpc.ibp.network/polkadot',
    ss58: 0,
    units: 10,
    unit: 'DOT',
    api: {
      instanceIndex: 0,
    },
  },
  chainSpec: {},
  apiInstanceId: 'tab_0_0',
};
