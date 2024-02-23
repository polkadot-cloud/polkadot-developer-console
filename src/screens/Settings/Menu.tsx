// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ChainMenuWrapper } from 'library/ChainMenu/Wrappers';
import { useSettings } from './provider';

export const SettingsMenu = () => {
  const { activeSection, setActiveSection } = useSettings();

  return (
    <ChainMenuWrapper>
      <div className="menu">
        <div className="label">Settings</div>
        <button
          className={activeSection === 0 ? 'active' : undefined}
          onClick={() => setActiveSection(0)}
        >
          Tags
        </button>
      </div>
    </ChainMenuWrapper>
  );
};
