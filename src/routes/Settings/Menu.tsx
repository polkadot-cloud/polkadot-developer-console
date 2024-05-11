// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonWrapper, HeaderMenuWrapper } from 'library/HeaderMenu/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { accentColors } from 'styles/accents/developer-console';
import type { RouteSectionProvider } from 'routes/Common/types';
import { useActiveTab } from 'contexts/ActiveTab';
import { useTabs } from 'contexts/Tabs';

export const SettingsMenu = ({ label, sections }: RouteSectionProvider) => {
  const navigate = useNavigate();
  const { tab, tabId } = useActiveTab();
  const { setTabActivePage } = useTabs();

  const activePage = tab?.activePage || 0;

  return (
    <HeaderMenuWrapper
      /* Overriding tab color to be the same as primary color. */
      style={Object.fromEntries([
        ['--accent-color-secondary', accentColors.primary.light],
      ])}
    >
      <div className="menu">
        <section>
          <div className="label">{label}</div>
          {Object.entries(sections).map(([key, section], index) => (
            <button
              key={`menu-section-${key}-${index}`}
              className={activePage === Number(key) ? 'active' : undefined}
              onClick={() => {
                setTabActivePage(tabId, 'settings', Number(key));
              }}
            >
              {section?.icon && (
                <FontAwesomeIcon icon={section.icon} className="icon" />
              )}
              {section.label}
            </button>
          ))}
        </section>
      </div>
      <div className="config">
        <ButtonWrapper onClick={() => navigate('/')} className="button">
          <FontAwesomeIcon icon={faCheck} />
          Done
        </ButtonWrapper>
      </div>
    </HeaderMenuWrapper>
  );
};
