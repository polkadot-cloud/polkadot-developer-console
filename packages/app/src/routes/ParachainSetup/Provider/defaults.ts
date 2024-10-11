// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import type { ApiPromise } from '@polkadot/api';
import { dummyChainSpec } from 'contexts/ChainSpaceEnv/defaults';
import { dummyChain } from 'routes/Chain/Provider/defaults';

export const defaultParachainContextInterface = {
  chain: dummyChain,
  chainSpec: dummyChainSpec,
  instanceId: 'tab_0_0',
  api: {} as ApiPromise,
};
