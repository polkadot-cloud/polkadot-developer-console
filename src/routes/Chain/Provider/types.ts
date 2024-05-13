// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TabChainData } from 'contexts/Tabs/types';
import type { APIChainSpec, ApiInstanceId } from 'model/Api/types';
import type { ReactNode } from 'react';

export interface IntegrityCheckedChainContextProps {
  chain: TabChainData;
  chainSpec: APIChainSpec;
  apiInstanceId: ApiInstanceId;
}

export type ChainContextProps = IntegrityCheckedChainContextProps & {
  children: ReactNode;
};
