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
import { useRoute } from 'contexts/Route';
import { ButtonWithTooltip } from '../ButtonWithTooltip';
import { useRedirectOnInactive } from 'hooks/useRedirectOnInactive';
import type { RouteSectionProvider } from 'routes/types';

export const TabMenu = ({ label, sections }: RouteSectionProvider) => {
  const { pathname } = useLocation();
  const { activePage, setActivePage } = useRoute();
  const { tabsHidden, setTabsHidden, activeTabId } = useTabs();

  // Redirect to section 0 if Api becomes inactive.
  useRedirectOnInactive(activeTabId);

  return (
    <HeaderMenuWrapper>
      <div className="menu">
        <section className="main">
          <div className="label">{label}</div>
          {Object.entries(sections).map(([key, section], index) => (
            <button
              key={`menu-section-${key}-${index}`}
              onClick={() => setActivePage(Number(key))}
              className={activePage === Number(key) ? 'active' : undefined}
            >
              {section.label}
            </button>
          ))}
        </section>
        <section className="other">{/* Additional links right side */}</section>
      </div>
      <div className="config">
        <ButtonWithTooltip
          tooltipText="Manage Tab"
          active={activePage === 9}
          onClick={() => setActivePage(9, false)}
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
