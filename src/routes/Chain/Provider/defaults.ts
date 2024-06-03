// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TabChainData } from 'contexts/Tabs/types';
import type { IntegrityCheckedChainContext } from './types';
import { dummyChainSpec } from 'contexts/ChainSpaceEnv/defaults';
import { ApiPromise } from '@polkadot/api';

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
  instanceId: 'tab_0_0',
  api: new ApiPromise(),
};
