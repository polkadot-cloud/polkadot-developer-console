// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ApiStatus } from 'model/Api/types';
import DisconnectSVG from 'svg/Disconnect.svg?react';
import ConnectSVG from 'svg/Connect.svg?react';

export const ConnectionIcon = ({ status }: { status: ApiStatus }) => (
  <div className={`connection ${status}`}>
    {['ready', 'connected', 'connecting'].includes(status) ? (
      <ConnectSVG />
    ) : (
      <DisconnectSVG />
    )}
  </div>
);
