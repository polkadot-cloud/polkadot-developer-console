// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsWrapper } from 'library/Settings/Wrappers';
import { TagSettings } from './TagSettings';
import { useSection } from 'library/Page/provider';

export const Settings = () => {
  const { activeSection } = useSection();

  return (
    <SettingsWrapper>{activeSection === 0 && <TagSettings />}</SettingsWrapper>
  );
};
