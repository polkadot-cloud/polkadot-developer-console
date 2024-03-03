// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faAngleDown,
  faAngleUp,
  faBarsProgress,
} from '@fortawesome/free-solid-svg-icons';
import { useTabs } from 'contexts/Tabs';
import { useLocation } from 'react-router-dom';
import { HeaderMenuWrapper } from 'library/HeaderMenu/Wrappers';
import { useSection } from 'library/Page/provider';
import { ButtonWithTooltip } from './ButtonWithTooltip';

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
        <section className="other">{/* Additional links right side */}</section>
      </div>
      <div className="config">
        <ButtonWithTooltip
          tooltipText="Manage Tab"
          active={activeSection === 1}
          onClick={() => setActiveSection(1, false)}
          icon={faBarsProgress}
          disabled={false}
          iconTransform="shrink-1"
        />

        <ButtonWithTooltip
          tooltipText={tabsHidden ? 'Show Tabs' : 'Hide Tabs'}
          active={false}
          onClick={() => setTabsHidden(!tabsHidden)}
          icon={tabsHidden ? faAngleDown : faAngleUp}
          disabled={pathname !== '/'}
          iconTransform="shrink-3"
        />
      </div>
    </HeaderMenuWrapper>
  );
};
