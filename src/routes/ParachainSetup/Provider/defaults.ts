// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ApiPromise } from '@polkadot/api';
import { dummyChainSpec } from 'contexts/ChainSpaceEnv/defaults';
import { dummyChain } from 'routes/Chain/Provider/defaults';

export const defaultParachainContextInterface = {
  chain: dummyChain,
  chainSpec: dummyChainSpec,
  instanceId: 'tab_0_0',
  api: new ApiPromise(),
};
