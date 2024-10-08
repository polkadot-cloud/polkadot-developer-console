// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import {
  faAngleDown,
  faAngleUp,
  faBarsProgress,
} from '@fortawesome/free-solid-svg-icons';
import { useTabs } from 'contexts/Tabs';
import { useLocation } from 'react-router-dom';
import { HeaderMenuWrapper } from 'library/HeaderMenu/Wrappers';
import { ButtonWithTooltip } from '../ButtonWithTooltip';
import type { RouteSectionProvider } from 'routes/Common/types';
import { useTooltip } from 'contexts/Tooltip';
import { useActiveTab } from 'contexts/ActiveTab';
import { useSettings } from 'contexts/Settings';
import { CloudIcon } from '@polkadot-cloud/icons';

export const TabMenu = ({ label, sections }: RouteSectionProvider) => {
  const { pathname } = useLocation();
  const { closeTooltip } = useTooltip();
  const { tab, tabId } = useActiveTab();
  const { setTabActivePage } = useTabs();
  const { tabsHidden, setTabsHidden } = useSettings();

  // Get the active page from tab.
  const activePage = tab?.activePage || 0;

  return (
    <HeaderMenuWrapper>
      <div className="menu">
        <section className="main">
          <div className="label">{label}</div>
          {Object.entries(sections).map(([key, section], index) => (
            <button
              key={`menu-section-${key}-${index}`}
              onClick={() => {
                setTabActivePage(tabId, 'default', Number(key));
              }}
              className={activePage === Number(key) ? 'active' : undefined}
            >
              {section?.icon && (
                <CloudIcon icon={section.icon} className="icon" />
              )}
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
          onClick={() => {
            closeTooltip();
            setTabActivePage(tabId, 'default', Number(9), false);
          }}
          icon={faBarsProgress}
          disabled={false}
          iconTransform="shrink-1"
        />

        <ButtonWithTooltip
          tooltipText={tabsHidden ? 'Show Tabs' : 'Hide Tabs'}
          active={false}
          onClick={() => {
            closeTooltip();
            setTabsHidden(!tabsHidden);
          }}
          icon={tabsHidden ? faAngleDown : faAngleUp}
          disabled={pathname !== '/'}
          iconTransform="shrink-1"
        />
      </div>
    </HeaderMenuWrapper>
  );
};
