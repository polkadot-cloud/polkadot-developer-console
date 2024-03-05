// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsHeaderWrapper } from 'library/Settings/Wrappers';
import { RenameTab } from './RenameTab';
import { PageContentWrapper } from 'library/Page/Wrapper';
import { AutoConnect } from '../AutoConnect';

export const ManageTab = () => (
  <PageContentWrapper>
    <SettingsHeaderWrapper>
      <h2>Manage Tab</h2>
      <div>
        <AutoConnect />
      </div>
    </SettingsHeaderWrapper>

    <RenameTab />
  </PageContentWrapper>
);
