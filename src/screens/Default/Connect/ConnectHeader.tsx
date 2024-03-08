// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTabs } from 'contexts/Tabs';
import { AutoConnect } from '../AutoConnect';
import { ConnectHeaderWrapper, ConnectMethodWrapper } from './Wrappers';

export const ConnectHeader = () => {
  const { activeTabId, setTabConnectFrom, getActiveTab } = useTabs();
  const tab = getActiveTab();

  return (
    <ConnectHeaderWrapper>
      <ConnectMethodWrapper>
        <button
          className={tab?.connectFrom === 'directory' ? 'active' : undefined}
          onClick={() => setTabConnectFrom(activeTabId, 'directory')}
        >
          Directory
        </button>
        <button
          className={tab?.connectFrom === 'customNode' ? 'active' : undefined}
          onClick={() => setTabConnectFrom(activeTabId, 'customNode')}
        >
          Custom Endpoint
        </button>
      </ConnectMethodWrapper>

      <AutoConnect />
    </ConnectHeaderWrapper>
  );
};
