// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TabChainData } from 'contexts/Tabs/types';
import type { IntegrityCheckedChainContext } from './types';
import { dummyChainSpec } from 'contexts/ChainSpaceEnv/defaults';

// NOTE: Only dummy values to keep the type checker happy. They are over-written by the
// initial context values upon initialisation.
export const dummyChain: TabChainData = {
  id: 'polkadot',
  endpoint: 'wss://rpc.ibp.network/polkadot',
  ss58: 0,
  units: 10,
  unit: 'DOT',
  api: {
    instanceIndex: 0,
  },
};

export const defaultChainContextInterface: IntegrityCheckedChainContext = {
  chain: dummyChain,
  chainSpec: dummyChainSpec,
  apiInstanceId: 'tab_0_0',
};
