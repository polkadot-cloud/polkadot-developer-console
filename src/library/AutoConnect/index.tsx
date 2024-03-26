// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Switch } from 'library/Switch';
import { useTabs } from 'contexts/Tabs';
import { Wrapper } from './Wrapper';
import { useActiveTabId } from 'contexts/ActiveTab';

export const AutoConnect = () => {
  const activeTabId = useActiveTabId();
  const { getTab, setTabAutoConnect } = useTabs();
  const activeTab = getTab(activeTabId);

  let autoConnectEnabled = activeTab?.autoConnect;
  if (autoConnectEnabled == undefined) {
    autoConnectEnabled = true;
  }

  // Handle auto connect toggle. Updates tab settings.
  const handleOnSwitch = (checked: boolean) => {
    setTabAutoConnect(activeTabId, checked);
  };

  return (
    <Wrapper>
      <h4
        style={{
          color: autoConnectEnabled ? 'var(--accent-color-primary)' : undefined,
        }}
      >
        Auto Connect
      </h4>
      <Switch
        scale={0.85}
        active={autoConnectEnabled}
        disabled={false}
        onSwitch={handleOnSwitch}
      />
    </Wrapper>
  );
};
