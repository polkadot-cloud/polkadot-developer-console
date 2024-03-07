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
import { useRedirectOnInactive } from 'hooks/useRedirectOnInactive';

export const ChainMenu = () => {
  const { getApiStatus, getApiActive } = useApi();
  const { pathname } = useLocation();
  const { activeSection, setActiveSection } = useSection();
  const { tabsHidden, setTabsHidden, activeTabId } = useTabs();

  // Redirect to section 0 if api becomes inactive.
  useRedirectOnInactive(activeTabId);

  const apiStatus = getApiStatus(activeTabId);
  const apiActive = getApiActive(activeTabId);

  let screenLabel;
  switch (apiStatus) {
    case 'connecting':
    case 'ready':
    case 'connected':
      screenLabel = 'Chain';
      break;
    default:
      screenLabel = 'Connect';
  }

  return (
    <HeaderMenuWrapper>
      <div className="menu">
        <section className="main">
          <div className="label"> {screenLabel}</div>
          <button
            onClick={() => setActiveSection(0)}
            className={activeSection === 0 ? 'active' : undefined}
          >
            {!apiActive ? 'Search Chain' : 'Overview'}
          </button>
          {apiActive && (
            <button
              onClick={() => setActiveSection(2)}
              className={activeSection === 2 ? 'active' : undefined}
            >
              Chain State
            </button>
          )}
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
