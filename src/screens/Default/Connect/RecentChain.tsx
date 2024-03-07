// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';
import { ChainListWrapper, Separator } from './Wrappers';
import { ChainListItem } from './ChainListItem';
import type { ChainId } from 'config/networks';

export const RecentChain = () => {
  const { activeTabId, getStoredChain, getActiveTab } = useTabs();
  const activeTab = getActiveTab();

  const result = getStoredChain(activeTabId);

  if (!result || !activeTab?.chain?.id) {
    return null;
  }

  return (
    <ChainListWrapper>
      <Separator />
      <h4>Recently Connected</h4>
      <ChainListItem chainId={result.id as ChainId} name={result.chain.name} />
    </ChainListWrapper>
  );
};
