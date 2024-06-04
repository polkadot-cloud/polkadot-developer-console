// Copyright 2024 @polkadot-cloud/developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Switch } from 'library/Switch';
import { useTabs } from 'contexts/Tabs';
import { Wrapper } from './Wrapper';
import { useActiveTab } from 'contexts/ActiveTab';

export const AutoConnect = () => {
  const { tab, tabId } = useActiveTab();
  const { setTabAutoConnect } = useTabs();

  let autoConnectEnabled = tab?.ui.autoConnect || false;

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
