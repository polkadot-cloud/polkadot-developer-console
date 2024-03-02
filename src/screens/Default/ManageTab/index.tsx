// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  SettingsHeaderWrapper,
  SettingsWrapper,
} from 'library/Settings/Wrappers';
import { RenameTab } from './RenameTab';

export const ManageTab = () => (
  <SettingsWrapper>
    <SettingsHeaderWrapper>
      <h2>Manage Tab</h2>
    </SettingsHeaderWrapper>
    <RenameTab />
  </SettingsWrapper>
);
