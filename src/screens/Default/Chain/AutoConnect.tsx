// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';
import { AutoConnectWrapper } from './Wrappers';
import { Switch } from 'library/Switch';

export const AutoConnect = () => {
  // Whether auto connect is turned on.
  const [autoConnect, setAutoConnect] = useState<boolean>(true);

  // Handle auto connect toggle.
  const handleOnSwitch = (val: boolean) => {
    setAutoConnect(val);
  };

  return (
    <AutoConnectWrapper>
      <h4
        style={{
          color: autoConnect ? 'var(--accent-color-secondary)' : undefined,
        }}
      >
        Auto Connect
      </h4>
      <Switch
        scale={0.85}
        active={autoConnect}
        disabled={false}
        onSwitch={handleOnSwitch}
      />
    </AutoConnectWrapper>
  );
};
