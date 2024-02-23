// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonWrapper, HeaderMenuWrapper } from 'library/HeaderMenu/Wrappers';
import { useSettings } from './provider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export const SettingsMenu = () => {
  const navigate = useNavigate();
  const { activeSection, setActiveSection } = useSettings();

  return (
    <HeaderMenuWrapper>
      <div className="menu">
        <div className="label">Settings</div>
        <button
          className={activeSection === 0 ? 'active' : undefined}
          onClick={() => setActiveSection(0)}
        >
          Tags
        </button>
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
