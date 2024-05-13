// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyJson } from '@w3ux/utils/types';
import type { TabChainData } from 'contexts/Tabs/types';
import type { ApiInstanceId } from 'model/Api/types';
import type { ReactNode } from 'react';

export interface IntegrityCheckedChainContext {
  chain: TabChainData;
  chainSpec: AnyJson; // TODO: Replace with ApiChainSpec and provide default chainSpec data structure.
  apiInstanceId: ApiInstanceId;
}

export type ChainContextProps = IntegrityCheckedChainContext & {
  children: ReactNode;
};
