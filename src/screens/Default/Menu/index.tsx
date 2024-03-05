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
import { useApi } from 'contexts/Api';

export const ChainMenu = () => {
  const { getApiStatus } = useApi();
  const { pathname } = useLocation();
  const { activeSection, setActiveSection } = useSection();
  const { tabsHidden, setTabsHidden, activeTabId } = useTabs();

  const apiStatus = getApiStatus(activeTabId);
  let statusLabel;
  switch (apiStatus) {
    case 'connecting':
      statusLabel = 'Connecting';
      break;
    case 'ready':
    case 'connected':
      statusLabel = 'Connected';
      break;
    default:
      statusLabel = 'Not Connected';
  }

  return (
    <HeaderMenuWrapper>
      <div className="menu">
        <section className="main">
          <div className="label"> {statusLabel}</div>
          <button
            onClick={() => setActiveSection(0)}
            className={activeSection === 0 ? 'active' : undefined}
          >
            Connect Chain
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
