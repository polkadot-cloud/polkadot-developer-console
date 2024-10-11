// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { TabChainData } from 'contexts/Tabs/types';
import type { IntegrityCheckedChainContext } from './types';
import { dummyChainSpec } from 'contexts/ChainSpaceEnv/defaults';
import type { ApiPromise } from '@polkadot/api';

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
  api: {} as ApiPromise,
};
