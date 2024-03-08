// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { NetworkDirectory } from 'config/networks';
import { isDirectoryId } from 'config/networks/Utils';
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
  const isDirectory = isDirectoryId(chainId);
  const chainSpecChain = chainSpec?.chain || 'Unknown';

  // Determine chain name based on chain spec.
  let displayName;
  if (isDirectory) {
    // Display directory name if the chain name matches that of directory.
    const match = NetworkDirectory[chainId].system?.chain === chainSpec?.chain;
    displayName = match ? NetworkDirectory[chainId].name : chainSpecChain;
  } else {
    // Custom endpoint: Default to chain spec chain name or 'Unknown' otherwise.
    displayName = chainSpecChain;
  }

  return (
    <PageContentWrapper>
      <h2>
        {!chainSpecReady && apiStatus === 'connecting'
          ? 'Connecting...'
          : chainSpecReady
            ? displayName
            : 'Fetching Chain Spec...'}
      </h2>
      <h4>
        {chainSpecReady
          ? `Connected to ${chainSpec?.chain} / ${chainSpec?.version.specName} ${chainSpec?.version.specVersion}`
          : ''}
      </h4>
    </PageContentWrapper>
  );
};
