// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkDirectory } from 'config/networks';
import { useTabs } from 'contexts/Tabs';
import { PageContentWrapper } from 'library/Page/Wrapper';

export const Overview = () => {
  const { getActiveTab } = useTabs();

  const activeTab = getActiveTab();
  const id = activeTab?.chain?.id;

  const name = id ? NetworkDirectory[id].name : 'Unknown';

  return (
    <PageContentWrapper>
      <h2>{name}</h2>
      <h4>{id}</h4>
    </PageContentWrapper>
  );
};
