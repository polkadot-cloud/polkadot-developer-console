// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsHeaderWrapper } from 'library/Settings/Wrappers';
import { SettingsToggleWrapper } from './Wrappers';
import { Switch } from 'library/Switch';
import { useSettings } from 'contexts/Settings';

export const TabSettings = () => {
  const { autoConnect, setAutoConnect, autoTabNaming, setAutoTabNaming } =
    useSettings();

  const handleAutoConnect = (checked: boolean) => {
    setAutoConnect(checked);
  };

  const handleAutoNaming = (checked: boolean) => {
    setAutoTabNaming(checked);
  };
  return (
    <>
      <SettingsHeaderWrapper>
        <h2>Tab Settings</h2>
      </SettingsHeaderWrapper>

      <SettingsToggleWrapper>
        <div className="text">
          <h4>Default Auto Connect</h4>
          <h3>Turn on auto connect by default when opening new tabs.</h3>
        </div>

        <Switch
          className="switch"
          scale={0.85}
          active={autoConnect}
          onSwitch={handleAutoConnect}
        />
      </SettingsToggleWrapper>

      <SettingsToggleWrapper>
        <div className="text">
          <h4>Auto Tab Naming</h4>
          <h3>Automatically rename tabs based on chain being connected to.</h3>
        </div>

        <Switch
          className="switch"
          scale={0.85}
          active={autoTabNaming}
          onSwitch={handleAutoNaming}
        />
      </SettingsToggleWrapper>
    </>
  );
};
