// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkDirectory } from 'config/networks';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { PageContentWrapper } from 'library/Page/Wrapper';

export const Overview = () => {
  const { getApiStatus, getChainSpec } = useApi();
  const { getActiveTab, activeTabId } = useTabs();

  const apiStatus = getApiStatus(activeTabId);
  const chainSpec = getChainSpec(activeTabId);

  const activeTab = getActiveTab();
  const id = activeTab?.chain?.id;

  const name = id
    ? NetworkDirectory[id].system?.chain === chainSpec?.chain
      ? NetworkDirectory[id].name
      : 'Unknown'
    : 'Unknown';

  return (
    <PageContentWrapper>
      <h2>
        {apiStatus === 'connecting'
          ? 'Connecting...'
          : chainSpec && ['ready'].includes(apiStatus)
            ? name
            : 'Fetching Chain Spec...'}
      </h2>
      <h4>
        {apiStatus !== 'ready'
          ? ''
          : `Connected to ${chainSpec?.chain} / ${chainSpec?.version.specName} ${chainSpec?.version.specVersion}`}
      </h4>
    </PageContentWrapper>
  );
};
