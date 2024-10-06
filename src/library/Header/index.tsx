// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { HeaderWrapper } from './Wrappers';
import HeaderSVG from 'svg/Header.svg?react';
import { version } from '../../../package.json';
import { useGlitch } from 'react-powerglitch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { DiscussionsUrl, DocsUrl, GithubRepoUrl } from 'consts';
import { faFileDoc, faMessages } from '@fortawesome/pro-solid-svg-icons';
import LogoSVG from 'svg/Logo.svg?react';

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
        <span className="icon">
          <span ref={glitch.ref}>
            <HeaderSVG
              style={{
                width: '100%',
                height: '100%',
                fill: 'var(--accent-color-primary)',
              }}
            />
          </span>
        </span>
        <span className="logo">
          <LogoSVG />
        </span>
        <span className="version">{version}</span>
      </div>
      <div>
        <button type="button" onClick={() => window.open(DocsUrl)}>
          <FontAwesomeIcon icon={faFileDoc} transform="grow-2" />
        </button>

        <button type="button" onClick={() => window.open(DiscussionsUrl)}>
          <FontAwesomeIcon icon={faMessages} transform="shrink-0" />
        </button>

        <button type="button" onClick={() => window.open(GithubRepoUrl)}>
          <FontAwesomeIcon icon={faGithub} transform="grow-2" />
        </button>
      </div>
    </HeaderWrapper>
  );
};
