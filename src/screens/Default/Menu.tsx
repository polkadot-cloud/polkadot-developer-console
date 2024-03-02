// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useTabs } from 'contexts/Tabs';
import { useLocation } from 'react-router-dom';
import { HeaderMenuWrapper, ButtonWrapper } from 'library/HeaderMenu/Wrappers';
import type { PageProps } from 'screens/Utils';

export const ChainMenu = ({ section, setSection }: PageProps) => {
  const { pathname } = useLocation();
  const { tabsHidden, setTabsHidden } = useTabs();

  return (
    <HeaderMenuWrapper>
      <div className="menu">
        <section className="main">
          <div className="label">Not Connected</div>
          <button
            onClick={() => setSection(0)}
            className={section === 0 ? 'active' : undefined}
          >
            Connect
          </button>
        </section>
        <section className="other">
          <button
            onClick={() => setSection(1)}
            className={`label${section === 1 ? ` active` : ``}`}
          >
            Manage Tab
          </button>
        </section>
      </div>
      <div className="config">
        <ButtonWrapper
          onClick={() => setTabsHidden(!tabsHidden)}
          disabled={pathname !== '/'}
        >
          <FontAwesomeIcon
            icon={tabsHidden ? faAngleDown : faAngleUp}
            transform="shrink-3"
          />
        </ButtonWrapper>
      </div>
    </HeaderMenuWrapper>
  );
};
