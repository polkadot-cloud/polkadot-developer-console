// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HeaderWrapper } from './Wrappers';
import HeaderSVG from 'svg/Header.svg?react';
import { version } from '../../../package.json';
import { useGlitch } from 'react-powerglitch';

export const Header = () => {
  const glitch = useGlitch({
    timing: {
      duration: 7500,
    },
    glitchTimeSpan: {
      start: 0.55,
      end: 0.65,
    },
    shake: {
      velocity: 2,
      amplitudeX: 0.2,
      amplitudeY: 0.2,
    },
  });

  return (
    <HeaderWrapper>
      <div>
        <span
          ref={glitch.ref}
          style={{ width: '1.1rem', height: '1.1rem', marginRight: '0.4rem' }}
        >
          <HeaderSVG
            style={{
              width: '100%',
              height: '100%',
              fill: 'var(--accent-color-secondary)',
            }}
          />
        </span>
        <h1>Polkadot Developer Console</h1>
        <span>{version}</span>
      </div>
      <div></div>
    </HeaderWrapper>
  );
};
