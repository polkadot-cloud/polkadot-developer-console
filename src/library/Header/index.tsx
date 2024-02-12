// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HeaderWrapper } from './Wrappers';
import ConsoleSVG from 'svg/Console.svg?react';
import { version } from '../../../package.json';
import { ButtonText } from '@polkadot-cloud/react';

export const Header = () => (
  <HeaderWrapper>
    <div>
      <ConsoleSVG
        style={{
          width: '1.25rem',
          marginRight: '0.5rem',
          fill: 'url(#console-gradient) var(--accent-color-primary)',
        }}
      />
      <h1>
        Polkadot Developer Console <span>{version}</span>
      </h1>
    </div>
    <div>
      <ButtonText
        iconTransform="shrink-2"
        text="Accounts"
        style={{ fontSize: '0.8rem', color: 'var(--accent-color-primary)' }}
      />
    </div>
  </HeaderWrapper>
);
