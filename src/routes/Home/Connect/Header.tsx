// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AutoConnect } from 'library/AutoConnect';
import { ConnectHeaderWrapper } from './Wrappers';
import { HeaderToggleWrapper } from 'library/HeaderToggle/Wrapper';
import { useActiveTab } from 'contexts/ActiveTab';
import { useChainBrowser } from 'contexts/ChainBrowser';

export const Header = () => {
  const { tabId, tab } = useActiveTab();
  const { setTabConnectFrom } = useChainBrowser();

  return (
    <ConnectHeaderWrapper>
      <HeaderToggleWrapper>
        <button
          className={
            tab?.ui.activeConnectFrom === 'directory' ? 'active' : undefined
          }
          onClick={() => setTabConnectFrom(tabId, 'directory')}
        >
          Directory
        </button>
        <button
          className={
            tab?.ui.activeConnectFrom === 'customEndpoint'
              ? 'active'
              : undefined
          }
          onClick={() => setTabConnectFrom(tabId, 'customEndpoint')}
        >
          Custom Endpoint
        </button>
      </HeaderToggleWrapper>

      <AutoConnect />
    </ConnectHeaderWrapper>
  );
};
