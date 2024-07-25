// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { Body } from 'library/Body';
import { Wrapper } from './Wrapper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { useTabs } from 'contexts/Tabs';
import HeaderSVG from 'svg/Header.svg?react';

export const Splash = () => {
  const { createTab } = useTabs();

  return (
    <Body>
      <Wrapper>
        <section>
          <HeaderSVG className="icon" />
          <h2>Get Started with Developer Console</h2>
          <button type="button" onClick={() => createTab()}>
            <FontAwesomeIcon icon={faPlus} transform="shrink-2" /> Create a New
            Tab
          </button>
        </section>
      </Wrapper>
    </Body>
  );
};
