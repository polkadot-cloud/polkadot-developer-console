// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainList } from './ChainList';
import { SearchChain } from './SearchChain';
import { PageContentWrapper } from 'library/Page/Wrapper';
import { RecentChain } from './RecentChain';
import { ConnectHeader } from './ConnectHeader';

export const Connect = () => (
  <PageContentWrapper>
    <ConnectHeader />
    <SearchChain />
    <RecentChain />
    <ChainList />
  </PageContentWrapper>
);
