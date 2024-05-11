// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Switch } from 'library/Switch';
import { useTabs } from 'contexts/Tabs';
import { Wrapper } from './Wrapper';
import { useActiveTab } from 'contexts/ActiveTab';
import { useSettings } from 'contexts/Settings';

export const AutoConnect = () => {
  const { tab, tabId } = useActiveTab();
  const { autoConnect } = useSettings();
  const { setTabAutoConnect } = useTabs();

  let autoConnectEnabled = !tab?.taskData
    ? autoConnect
    : tab.taskData.autoConnect;

  if (autoConnectEnabled == undefined) {
    autoConnectEnabled = true;
  }

  // Handle auto connect toggle. Updates tab settings.
  const handleOnSwitch = (checked: boolean) => {
    setTabAutoConnect(tabId, checked);
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
