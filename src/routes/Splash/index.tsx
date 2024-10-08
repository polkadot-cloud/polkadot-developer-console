// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { Body } from 'library/Body';
import { Wrapper } from './Wrapper';
import { iconPlus } from '@polkadot-cloud/icons/solid';
import { useTabs } from 'contexts/Tabs';
import HeaderSVG from 'svg/Header.svg?react';
import { CloudIcon } from '@polkadot-cloud/icons';

export const Splash = () => {
  const { createTab } = useTabs();

  return (
    <Body>
      <Wrapper>
        <section>
          <HeaderSVG className="icon" />
          <h2>Get Started with Developer Console</h2>
          <button type="button" onClick={() => createTab()}>
            <CloudIcon icon={iconPlus} transform="shrink-2" /> Create a New Tab
          </button>
        </section>
      </Wrapper>
    </Body>
  );
};
