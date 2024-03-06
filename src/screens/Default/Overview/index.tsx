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
  const chainSpecReady = !!chainSpec;

  // NOTE: we know for certain there is an active tab and an associated API instance here, so we can
  // safely use the non-null assertion.
  const chainId = getActiveTab()!.chain!.id;

  return (
    <PageContentWrapper>
      <h2>
        {apiStatus === 'connecting'
          ? 'Connecting...'
          : chainSpecReady
            ? // Ensure the chain name matches system.chain in the chain spec before displaying it.
              NetworkDirectory[chainId].system?.chain === chainSpec?.chain
              ? NetworkDirectory[chainId].name
              : 'Unknown'
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
