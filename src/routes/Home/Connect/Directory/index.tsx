// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

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
