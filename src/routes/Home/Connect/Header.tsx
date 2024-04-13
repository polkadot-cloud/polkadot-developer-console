// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';
import { AutoConnect } from '../../../library/AutoConnect';
import { ConnectHeaderWrapper } from './Wrappers';
import { HeaderToggleWrapper } from 'library/HeaderToggle/Wrapper';
import { useActiveTabId } from 'contexts/ActiveTab';

export const Header = () => {
  const activeTabId = useActiveTabId();
  const { setTabConnectFrom, getTab } = useTabs();
  const tab = getTab(activeTabId);

  return (
    <ConnectHeaderWrapper>
      <HeaderToggleWrapper>
        <button
          className={tab?.connectFrom === 'directory' ? 'active' : undefined}
          onClick={() => setTabConnectFrom(activeTabId, 'directory')}
        >
          Directory
        </button>
        <button
          className={
            tab?.connectFrom === 'customEndpoint' ? 'active' : undefined
          }
          onClick={() => setTabConnectFrom(activeTabId, 'customEndpoint')}
        >
          Custom Endpoint
        </button>
      </HeaderToggleWrapper>

      <AutoConnect />
    </ConnectHeaderWrapper>
  );
};
