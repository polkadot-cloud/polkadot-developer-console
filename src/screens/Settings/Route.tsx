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
    label: 'Workspace',
    Component: WorkspaceSettings,
  },
  1: {
    label: 'Tabs',
    Component: TabSettings,
  },
  2: {
    label: 'Tags',
    Component: TagSettings,
  },
};

export const SettingsRoute = () => (
  <PageWithMenu pageId="settings" Page={Settings} Menu={SettingsMenu} />
);
