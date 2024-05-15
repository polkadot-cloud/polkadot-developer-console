// Copyright 2024 @polkadot-developer-console/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiStatus } from 'model/Api/types';
import DisconnectedSVG from 'svg/Disconnected.svg?react';
import ConnectedSVG from 'svg/Connected.svg?react';

export const ConnectionIcon = ({ status }: { status: ApiStatus }) => (
  <div className={`connection ${status}`}>
    {['ready', 'connected'].includes(status) ? (
      <ConnectedSVG />
    ) : (
      <DisconnectedSVG />
    )}
  </div>
);
