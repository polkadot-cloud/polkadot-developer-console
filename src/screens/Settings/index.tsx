// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsWrapper } from './Wrappers';
import { useSettings } from './provider';
import { TagSettings } from './TagSettings';

export const Settings = () => {
  const { activeSection } = useSettings();

  return (
    <SettingsWrapper>{activeSection === 0 && <TagSettings />}</SettingsWrapper>
  );
};
