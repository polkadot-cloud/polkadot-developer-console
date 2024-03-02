// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsWrapper } from 'library/Settings/Wrappers';
import { TagSettings } from './TagSettings';
import { useSection } from 'library/Page/provider';
import { TabSettings } from './TabSettings';

export const Settings = () => {
  const { activeSection } = useSection();

  return (
    <SettingsWrapper>
      {activeSection === 0 && <TabSettings />}
      {activeSection === 1 && <TagSettings />}
    </SettingsWrapper>
  );
};
