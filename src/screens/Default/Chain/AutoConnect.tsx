// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';
import { AutoConnectWrapper } from './Wrappers';
import { Switch } from 'library/Switch';

export const AutoConnect = () => {
  // Whether auto connect is turned on.

  // TODO: make settings:autoConnect as default value, or use last local saved value.
  const [autoConnectEnabled, setAutoConnectEnabled] = useState<boolean>(true);

  // Handle auto connect toggle.
  const handleOnSwitch = (val: boolean) => {
    setAutoConnectEnabled(val);
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
