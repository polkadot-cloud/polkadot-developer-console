// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';
import { ChainListWrapper, Separator } from './Wrappers';
import { ChainListItem } from './ChainListItem';
import type { ChainId } from 'config/networks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

export const RecentChain = () => {
  const { activeTabId, getStoredChain, getActiveTab, forgetTabChain } =
    useTabs();
  const activeTab = getActiveTab();

  const result = getStoredChain(activeTabId);

  if (!result || !activeTab?.chain?.id) {
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
                forgetTabChain(activeTabId);
              }
            }}
          >
            <FontAwesomeIcon icon={faMinus} transform="shrink-4" />
            Dismiss
          </button>
        </span>
      </h4>
      <ChainListItem chainId={result.id as ChainId} name={result.chain.name} />
    </ChainListWrapper>
  );
};
