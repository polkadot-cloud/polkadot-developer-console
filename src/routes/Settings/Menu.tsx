// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonWrapper, HeaderMenuWrapper } from 'library/HeaderMenu/Wrappers';
import { useRoute } from '../../contexts/Route';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { SettingsSections, ScreenLabel } from './Route';
import { accentColors } from 'theme/accents/developer-console';

export const SettingsMenu = () => {
  const navigate = useNavigate();
  const { activePage, setActivePage } = useRoute();

  return (
    <HeaderMenuWrapper
      /* Overriding tab color to be the same as primary color. */
      style={Object.fromEntries([
        ['--accent-color-secondary', accentColors.primary.light],
      ])}
    >
      <div className="menu">
        <section>
          <div className="label">{ScreenLabel}</div>
          {Object.entries(SettingsSections).map(([key, { label }], index) => (
            <button
              key={`menu-section-${key}-${index}`}
              className={activePage === Number(key) ? 'active' : undefined}
              onClick={() => setActivePage(Number(key))}
            >
              {label}
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
