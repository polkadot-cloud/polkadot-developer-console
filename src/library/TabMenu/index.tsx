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
import { ButtonWithTooltip } from '../ButtonWithTooltip';
import type { RouteSectionProvider } from 'routes/Common/types';
import { useTooltip } from 'contexts/Tooltip';
import { useActiveTab } from 'contexts/ActiveTab';
import { useApi } from 'contexts/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const TabMenu = ({ label, sections }: RouteSectionProvider) => {
  const { getApiActive } = useApi();
  const { pathname } = useLocation();
  const { closeTooltip } = useTooltip();
  const { tab, tabId, apiInstanceId } = useActiveTab();
  const { tabsHidden, setTabsHidden, setTabActivePage } = useTabs();

  // Get whether the api instance associated with this tab is active.
  const apiActive = getApiActive(apiInstanceId);

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
                setTabActivePage(tabId, 'default', Number(key), apiActive);
              }}
              className={activePage === Number(key) ? 'active' : undefined}
            >
              {section?.icon && (
                <FontAwesomeIcon icon={section.icon} className="icon" />
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
            setTabActivePage(tabId, 'default', Number(9), apiActive, false);
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
          iconTransform="shrink-3"
        />
      </div>
    </HeaderMenuWrapper>
  );
};
