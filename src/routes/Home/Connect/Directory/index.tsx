// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainList } from './ChainList';
import { RecentChain } from './RecentChain';
import { SearchChain } from './SearchChain';

export const Directory = () => (
  <>
    <SearchChain />
    <RecentChain />
    <ChainList />
  </>
);
