// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AutoConnect } from '../AutoConnect';
import { ConnectHeaderWrapper, ConnectMethodWrapper } from './Wrappers';

export const ConnectHeader = () => (
  <ConnectHeaderWrapper>
    <ConnectMethodWrapper>
      <button
        className="active"
        onClick={() => {
          /* Do nothing */
        }}
      >
        Directory
      </button>
      <button
        onClick={() => {
          /* Do nothing */
        }}
      >
        Local Node
      </button>
    </ConnectMethodWrapper>

    <AutoConnect />
  </ConnectHeaderWrapper>
);
