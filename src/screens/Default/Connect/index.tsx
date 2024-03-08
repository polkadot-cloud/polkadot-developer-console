// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainList } from './ChainList';
import { SearchChain } from './SearchChain';
import { PageContentWrapper } from 'library/Page/Wrapper';
import { RecentChain } from './RecentChain';
import { ConnectHeader } from './ConnectHeader';
import { useTabs } from 'contexts/Tabs';
import { LocalNodeInput } from './LocaNodeInput';

export const Connect = () => {
  const { getActiveTab } = useTabs();
  const tab = getActiveTab();
  const connectFrom = tab?.connectFrom;

  return (
    <PageContentWrapper>
      <ConnectHeader />
      {connectFrom === 'customNode' && <LocalNodeInput />}
      {connectFrom === 'directory' && (
        <>
          <SearchChain />
          <RecentChain />
          <ChainList />
        </>
      )}
    </PageContentWrapper>
  );
};
