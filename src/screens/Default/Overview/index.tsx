// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkDirectory } from 'config/networks';
import { useApi } from 'contexts/Api';
import { useTabs } from 'contexts/Tabs';
import { ApiController } from 'controllers/ApiController';
import { PageContentWrapper } from 'library/Page/Wrapper';

export const Overview = () => {
  const { getApiStatus } = useApi();
  const { getActiveTab, activeTabId } = useTabs();

  const apiStatus = getApiStatus(activeTabId);

  const activeTab = getActiveTab();
  const id = activeTab?.chain?.id;

  const spec = ApiController.instances[activeTabId].chainSpec;
  const name = id
    ? NetworkDirectory[id].system?.chain === spec?.chain
      ? NetworkDirectory[id].name
      : 'Unknown'
    : 'Unknown';

  return (
    <PageContentWrapper>
      <h2>
        {apiStatus === 'connecting'
          ? 'Connecting...'
          : apiStatus === 'ready'
            ? name
            : 'Fetching Chain Spec...'}
      </h2>
      <h4>
        {apiStatus !== 'ready'
          ? ''
          : `Connected to ${spec?.chain} / ${spec?.version.specName} ${spec?.version.specVersion}`}
      </h4>
    </PageContentWrapper>
  );
};
