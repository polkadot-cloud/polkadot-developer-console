// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsMenu } from './Menu';
import { PageWithMenu } from 'routes/Common/PageWithMenu';
import { WorkspaceSettings } from './WorkspaceSettings';
import { TabSettings } from './TabSettings';
import { TagSettings } from './TagSettings';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import {
  faBrowsers,
  faRectangleHistory,
  faTags,
} from '@fortawesome/pro-duotone-svg-icons';

export const useRouteSections = (): RouteSectionProvider => {
  const sections: PageSections = {
    0: {
      label: 'Tabs',
      icon: faRectangleHistory,
      Component: TabSettings,
    },
    1: {
      label: 'Tags',
      icon: faTags,
      Component: TagSettings,
    },
    2: {
      label: 'Workspace',
      icon: faBrowsers,
      Component: WorkspaceSettings,
    },
  };

  return { label: 'Settings', sections, pageWidth: 'thin' };
};

export const Settings = () => (
  <PageWithMenu
    route="settings"
    routeProvider={useRouteSections}
    Menu={SettingsMenu}
  />
);
