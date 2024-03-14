// Copyright 2024 @rossbulat/console authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { SettingsMenu } from './Menu';
import { PageWithMenu } from 'routes/Common/PageWithMenu';
import { WorkspaceSettings } from './WorkspaceSettings';
import { TabSettings } from './TabSettings';
import { TagSettings } from './TagSettings';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import { PageContent } from 'library/PageContent';

export const useRouteSections = (): RouteSectionProvider => {
  const sections: PageSections = {
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

  return { label: 'Settings', sections, pageWidth: 'thin' };
};

export const Settings = () => (
  <PageWithMenu
    route="settings"
    routeProvider={useRouteSections}
    Page={PageContent}
    Menu={SettingsMenu}
  />
);
