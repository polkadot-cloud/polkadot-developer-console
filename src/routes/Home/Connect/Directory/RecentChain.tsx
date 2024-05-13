// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainListWrapper, Separator } from '../Wrappers';
import { ChainDirectoryItem } from './ChainDirectoryItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import type { DirectoryId } from 'config/networks';
import { useActiveTab } from 'contexts/ActiveTab';
import { useChainBrowser } from 'contexts/ChainBrowser';

export const RecentChain = () => {
  const { tab, tabId } = useActiveTab();
  const { getStoredChain, forgetTabChain } = useChainBrowser();

  const result = getStoredChain(tabId);

  if (!result || !tab?.taskData?.chain?.id) {
    return null;
  }

  return (
    <ChainListWrapper>
      <Separator />
      <h4>
        Recently Connected
        <span>
          <button
            onClick={() => {
              if (
                window.confirm('Are you sure you want to forget this chain?')
              ) {
                forgetTabChain(tabId);
              }
            }}
          >
            <FontAwesomeIcon icon={faMinus} transform="shrink-4" />
            Dismiss
          </button>
        </span>
      </h4>
      <ChainDirectoryItem
        chainId={result.id as DirectoryId}
        name={result.chain.name}
      />
    </ChainListWrapper>
  );
};
