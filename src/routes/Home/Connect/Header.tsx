// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';
import { AutoConnect } from 'library/AutoConnect';
import { ConnectHeaderWrapper } from './Wrappers';
import { HeaderToggleWrapper } from 'library/HeaderToggle/Wrapper';
import { useActiveTab } from 'contexts/ActiveTab';

export const Header = () => {
  const { tabId, tab } = useActiveTab();
  const { setTabConnectFrom } = useTabs();

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
