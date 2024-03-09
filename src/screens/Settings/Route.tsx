// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsMenu } from './Menu';
import { Settings } from '.';
import { PageWithMenu } from 'screens/Common/PageWithMenu';
import { WorkspaceSettings } from './WorkspaceSettings';
import { TabSettings } from './TabSettings';
import { TagSettings } from './TagSettings';
import type { ScreenSections } from 'screens/types';

export const ScreenLabel = 'Settings';

export const SettingsSections: ScreenSections = {
  0: {
    label: 'Tabs',
    Component: TabSettings,
  },
  1: {
    label: 'Tags',
    Component: TagSettings,
  },
  2: {
    label: 'Workspace',
    Component: WorkspaceSettings,
  },
};

export const SettingsRoute = () => (
  <PageWithMenu pageId="settings" Page={Settings} Menu={SettingsMenu} />
);
