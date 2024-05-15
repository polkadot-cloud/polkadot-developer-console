// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { dummyChainSpec } from 'contexts/ChainSpaceEnv/defaults';
import { dummyChain } from 'routes/Chain/Provider/defaults';

export const defaultParachainContextInterface = {
  chain: dummyChain,
  chainSpec: dummyChainSpec,
  apiInstanceId: 'tab_0_0',
};
