// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { HeaderButtonWrapper, SettingsWrapper } from './Wrappers';
import { useSettings } from './provider';
import { TagSettings } from './TagSettings';

export const Settings = () => {
  const { activeSection } = useSettings();

  return (
    <SettingsWrapper>
      <section className="head">
        <HeaderButtonWrapper
          onClick={() => {
            /* Do nothing */
          }}
          disabled
        >
          Revert Changes
        </HeaderButtonWrapper>
      </section>

      {activeSection === 0 && <TagSettings />}
    </SettingsWrapper>
  );
};
