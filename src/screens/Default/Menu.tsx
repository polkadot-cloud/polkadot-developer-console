// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useTabs } from 'contexts/Tabs';
import { useLocation } from 'react-router-dom';
import { HeaderMenuWrapper, ButtonWrapper } from 'library/HeaderMenu/Wrappers';
import { useSection } from 'library/Page/provider';

export const ChainMenu = () => {
  const { pathname } = useLocation();
  const { tabsHidden, setTabsHidden } = useTabs();
  const { activeSection, setActiveSection } = useSection();

  return (
    <HeaderMenuWrapper>
      <div className="menu">
        <section className="main">
          <div className="label">Not Connected</div>
          <button
            onClick={() => setActiveSection(0)}
            className={activeSection === 0 ? 'active' : undefined}
          >
            Connect
          </button>
        </section>
        <section className="other">
          <button
            onClick={() => setActiveSection(1)}
            className={`label${activeSection === 1 ? ` active` : ``}`}
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
