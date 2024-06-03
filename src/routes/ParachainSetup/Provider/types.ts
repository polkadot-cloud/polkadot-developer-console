// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiPromise } from '@polkadot/api';
import type { TabChainData } from 'contexts/Tabs/types';
import type { APIChainSpec, ApiInstanceId } from 'model/Api/types';
import type { ReactNode } from 'react';

export interface IntegrityCheckedParachainContext {
  chain: TabChainData;
  chainSpec: APIChainSpec;
  instanceId: ApiInstanceId;
  api: ApiPromise;
}

export type ParachainContextProps = IntegrityCheckedParachainContext & {
  children: ReactNode;
};
