// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AutoConnectWrapper } from './Wrappers';
import { Switch } from 'library/Switch';
import { useTabs } from 'contexts/Tabs';

export const AutoConnect = () => {
  const { getActiveTab, tabs, setTabs } = useTabs();

  let autoConnectEnabled = getActiveTab()?.autoConnect;
  if (autoConnectEnabled == undefined) {
    autoConnectEnabled = true;
  }

  // Handle auto connect toggle. Updates tab settings.
  const handleOnSwitch = (checked: boolean) => {
    setTabs(
      tabs.map((tab) => {
        if (tab.id === getActiveTab()?.id) {
          return {
            ...tab,
            autoConnect: checked,
          };
        }
        return tab;
      })
    );
  };

  return (
    <AutoConnectWrapper>
      <h4
        style={{
          color: autoConnectEnabled
            ? 'var(--accent-color-secondary)'
            : undefined,
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
    </AutoConnectWrapper>
  );
};
