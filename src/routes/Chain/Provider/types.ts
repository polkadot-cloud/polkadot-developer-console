// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { TabChainData } from 'contexts/Tabs/types';
import type { ApiInstanceId } from 'model/Api/types';
import type { ReactNode } from 'react';

export interface IntegrityCheckedChainContextProps {
  chain: TabChainData;
  apiInstanceId: ApiInstanceId;
}

export type ChainContextProps = IntegrityCheckedChainContextProps & {
  children: ReactNode;
};
