// Copyright 2024 @polkadot-cloud/polkadot-developer-console authors & contributors
// SPDX-License-Identifier: AGPL-3.0

import { WorkspaceSettings } from './WorkspaceSettings';
import { TabSettings } from './TabSettings';
import { TagSettings } from './TagSettings';
import type { PageSections, RouteSectionProvider } from 'routes/Common/types';
import {
  faBrowsers,
  faRectangleHistory,
  faTags,
} from '@fortawesome/pro-duotone-svg-icons';
import { useSettings } from 'contexts/Settings';
import { StickyMenu } from 'routes/Common/Wrappers';
import { SettingsMenu } from './Menu';
import { Body } from 'library/Body';
import { PageWrapper } from 'library/PageContent/Wrappers';
import { SettingsContent } from 'library/PageContent/Settings';

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

export const Settings = () => {
  const { tabsHidden } = useSettings();
  const routeConfig = useRouteSections();

  return (
    <>
      <StickyMenu className={tabsHidden ? 'tabsHidden' : ''}>
        <SettingsMenu {...routeConfig} />
      </StickyMenu>
      <Body>
        <PageWrapper>
          <SettingsContent {...routeConfig} />
        </PageWrapper>
      </Body>
    </>
  );
};
